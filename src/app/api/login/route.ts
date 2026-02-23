import { NextResponse } from "next/server";
import { encryptPaseto } from "@/lib/auth-paseto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Cari admin berdasarkan email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 2. Verifikasi password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 3. Buat payload PASETO
    const payload = {
      userId: admin.id,
      role: admin.role,
      email: admin.email,
    };

    const token = await encryptPaseto(payload);
    const cookieStore = await cookies();

    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600, // 1 hour
    });

    return NextResponse.json({ 
      success: true, 
      message: "Login berhasil",
      role: admin.role 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan sistem" },
      { status: 500 }
    );
  }
}
