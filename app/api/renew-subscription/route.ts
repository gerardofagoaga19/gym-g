import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 30);

    await prisma.subscription.updateMany({
      where: { gymId: user.gymId },
      data: {
        status: "active",
        expiresAt: newDate, // ✅ ESTE ES EL CORRECTO
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("RENEW ERROR:", error);
    return NextResponse.json(
      { error: "Error al renovar suscripción" },
      { status: 500 }
    );
  }
}