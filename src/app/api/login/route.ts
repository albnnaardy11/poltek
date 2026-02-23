import { NextResponse } from "next/server";
import { encryptPaseto } from "@/lib/auth-paseto";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma"; // Raw client — no audit extension, full field access
import bcrypt from "bcryptjs";

// ── Rate Limiter (In-Memory) ───────────────────────────────────────────────────
// For multi-instance deployments, swap this with src/lib/redis.ts limitRate()
const RATE_LIMIT = { attempts: 5, windowMs: 15 * 60 * 1000 };
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { blocked: boolean } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { blocked: false };
  }
  if (entry.count >= RATE_LIMIT.attempts) return { blocked: true };
  entry.count++;
  return { blocked: false };
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
// ──────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const ip = getRateLimitKey(request);
  const { blocked } = checkRateLimit(ip);

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

    // Raw DB fetch — bypasses audit extension intentionally.
    // Pre-session login must not depend on session context (avoids chicken-and-egg).
    const admin = await db.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, // explicitly needed for bcrypt comparison
        role: true,
      },
    });

    // Constant-time comparison — prevents user enumeration via timing side-channel
    const DUMMY_HASH = "$2a$10$x/7LJ3RaRHbp.9f3n1a2yuKKy2bCMfBZWfTsaHJAi5MbDpKYIjSk6";
    const hashToCompare = admin?.password ?? DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(password, hashToCompare);

    if (!admin || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah." },
        { status: 401 }
      );
    }

    clearRateLimit(ip);

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
}
