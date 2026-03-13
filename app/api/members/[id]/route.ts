import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// ==========================
// 📄 GET MEMBER + PAYMENTS + CHECKINS
// ==========================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params;

    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const member = await prisma.member.findFirst({
      where: {
        id: id,
        gymId: user.gymId
      },
      include: {
        payments: {
          orderBy: {
            createdAt: "desc"
          }
        },
        checkins: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!member) {
      return NextResponse.json(
        { error: "Miembro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);

  } catch (error) {
    console.error("GET MEMBER ERROR:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// ==========================
// 🔐 Obtener usuario del token
// ==========================
async function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    return user;
  } catch {
    return null;
  }
}

// ==========================
// 🗑 DELETE MEMBER
// ==========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params;

    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const member = await prisma.member.findFirst({
      where: {
        id: id,
        gymId: user.gymId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Miembro no encontrado" },
        { status: 404 }
      );
    }

    // ==========================
    // 🔥 SOFT DELETE PROFESIONAL
    // ==========================
    await prisma.member.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      message: "Miembro desactivado correctamente",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}