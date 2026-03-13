import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 🔥 Buscar suscripción del gym
    const subscription = await prisma.subscription.findFirst({
      where: {
        gymId: user.gymId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No hay suscripción activa" },
        { status: 403 }
      );
    }

    const now = new Date();

    if (subscription.expiresAt < now) {
      return NextResponse.json(
        { error: "Tu suscripción ha expirado" },
        { status: 403 }
      );
    }

    // 🔐 Crear token
    const token = jwt.sign(
      {
        userId: user.id,
        gymId: user.gymId,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 🔥 Respuesta al frontend
    return NextResponse.json({
      token,
      role: user.role,
      gymId: user.gymId
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}