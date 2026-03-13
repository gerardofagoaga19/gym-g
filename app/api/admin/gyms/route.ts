import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const gyms = await prisma.gym.findMany({
      include: {
        members: true,
        subscriptions: true
      }
    });

    return NextResponse.json(gyms);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error obteniendo gimnasios" },
      { status: 500 }
    );

  }
}