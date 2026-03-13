import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {

  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string; gymId: string };

    const { memberId } = await req.json();

    if (!memberId) {
      return NextResponse.json(
        { error: "MemberId requerido" },
        { status: 400 }
      );
    }

    const checkin = await prisma.checkin.create({
      data: {
        memberId,
        gymId: payload.gymId,
      },
    });

    return NextResponse.json(checkin);

  } catch {

    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );

  }

}