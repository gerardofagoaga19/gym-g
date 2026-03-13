import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gymName, email, password } = body;

    if (!gymName || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Crear gym
    const gym = await prisma.gym.create({
      data: {
        name: gymName,
      },
    });

    // Crear usuario admin
    const user = await prisma.user.create({
      data: {
        email,
        password,
        gymId: gym.id,
      },
    });

    // 🔥 Crear suscripción trial 7 días
    const trialExpires = new Date();
    trialExpires.setDate(trialExpires.getDate() + 7);

    await prisma.subscription.create({
      data: {
        gymId: gym.id,
        plan: "pro",
        status: "trial",
        expiresAt: trialExpires,
      },
    });

    // Crear token
    const token = jwt.sign(
      {
        userId: user.id,
        gymId: gym.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Error al registrar gym" },
      { status: 500 }
    );
  }
}

