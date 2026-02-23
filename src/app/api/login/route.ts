import { NextResponse } from "next/server";
import { encryptPaseto } from "@/lib/auth-paseto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { withAuditContext } from "@/lib/auth-utils";
import bcrypt from "bcryptjs";

// ── In-Memory Rate Limiter ────────────────────────────────────────────────────
// Stateless edge-compatible. For clustered deployments, replace with Redis/Upstash.
const RATE_LIMIT = { attempts: 5, windowMs: 15 * 60 * 1000 }; // 5 tries / 15 min
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(request: Request) {
  const headersList = request.headers;
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { blocked: boolean; remaining: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { blocked: false, remaining: RATE_LIMIT.attempts - 1 };
  }

  if (entry.count >= RATE_LIMIT.attempts) {
    return { blocked: true, remaining: 0 };
  }

  entry.count++;
  return { blocked: false, remaining: RATE_LIMIT.attempts - entry.count };
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const ip = getRateLimitKey(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Wrap the entire login logic in an Audit Context
  return await withAuditContext(ip, userAgent, async () => {
    const { blocked } = await checkRateLimit(ip);

    if (blocked) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." },
        { status: 429 }
      );
    }

    try {
      const body = await request.json();
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");

      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Email dan password wajib diisi." },
          { status: 400 }
        );
      }

      // 1. Fetch admin record with EXPLICIT password selection to bypass any global filters or type regressions
      const admin = await prisma.admin.findUnique({ 
        where: { email },
        select: {
          id: true,
          email: true,
          password: true, // We need this for bcrypt
          role: true,
        }
      });

      const DUMMY_HASH = "$2a$10$x/7LJ3RaRHbp.9f3n1a2yuKKy2bCMfBZWfTsaHJAi5MbDpKYIjSk6";
      const hashToCompare = admin?.password ?? DUMMY_HASH;

      // 2. Constant-time compare
      const isPasswordValid = await bcrypt.compare(password, hashToCompare);

      if (!admin || !isPasswordValid) {
        return NextResponse.json(
          { success: false, error: "Email atau password salah." },
          { status: 401 }
        );
      }

      // 3. Success Flow
      await clearRateLimit(ip);

      const token = await encryptPaseto({
        userId: admin.id,
        role: admin.role,
        email: admin.email,
      });

      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/admin",
        maxAge: 60 * 60 * 8, 
      });

      return NextResponse.json({ success: true, role: admin.role });

    } catch (error) {
      console.error("[AUTH] Login Error:", error);
      return NextResponse.json(
        { success: false, error: "Terjadi kesalahan sistem." },
        { status: 500 }
      );
    }
  });
}

