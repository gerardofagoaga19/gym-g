import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { checkSubscription } from "@/lib/checkSubscription";


// =======================
// GET → Obtener miembros
// =======================
export async function GET(req: Request) {
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

    // 🔥 Validamos suscripción
    const hasAccess = await checkSubscription(user.gymId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Suscripción vencida" },
        { status: 403 }
      );
    }

    // 🔴 DESACTIVAR MIEMBROS VENCIDOS AUTOMÁTICAMENTE
    await prisma.member.updateMany({
      where: {
        gymId: user.gymId,
        isActive: true,
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        isActive: false,
      },
    });

    // obtener parametro de búsqueda
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const members = await prisma.member.findMany({
  where: {
    gymId: user.gymId,
    name: {
      contains: search,
      mode: "insensitive",
    },
  },

  include: {
    checkins: {
      orderBy: {
        createdAt: "desc"
      }
    }
  },

  orderBy: { createdAt: "desc" },
});

    return NextResponse.json(members);

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Error al obtener miembros" },
      { status: 500 }
    );
  }
}


// =======================
// POST → Crear miembro
// =======================
export async function POST(req: Request) {
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

    const hasAccess = await checkSubscription(user.gymId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Suscripción vencida" },
        { status: 403 }
      );
    }

    const { firstName, lastName, secondLastName, phone, planType } = await req.json();

    if (!firstName || !lastName || !secondLastName || !planType) {
      return NextResponse.json(
        { error: "Nombre y apellidos requeridos" },
        { status: 400 }
      );
    }

    const now = new Date();
    let newExpireDate = new Date(now);
    let amount = 0;

    // 🔥 LÓGICA REAL DE PLANES
    if (planType === "DAY") {
      newExpireDate.setDate(newExpireDate.getDate() + 1);
      amount = 50;
    }

    if (planType === "MONTH") {
      newExpireDate.setMonth(newExpireDate.getMonth() + 1);
      amount = 500;
    }

    if (planType === "YEAR") {
      newExpireDate.setFullYear(newExpireDate.getFullYear() + 1);
      amount = 5000;
    }

    if (planType === "PROMO") {
      newExpireDate.setDate(newExpireDate.getDate() + 15);
      amount = 300;
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        gymId: user.gymId,
        firstName,
        lastName,
        secondLastName,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Este miembro ya está registrado" },
        { status: 400 }
      );
    }

    // 1️⃣ Crear miembro
    const fullName = `${firstName} ${lastName} ${secondLastName}`;

    const member = await prisma.member.create({
      data: {
        name: fullName,
        firstName,
        lastName,
        secondLastName,
        phone,
        gymId: user.gymId,
        expiresAt: newExpireDate,
        isActive: true,
      },
    });

    // 2️⃣ Crear pago automático
    await prisma.payment.create({
      data: {
        memberId: member.id,
        gymId: user.gymId,
        amount,
        planType,
        method: "EFECTIVO",
        startDate: now,
        endDate: newExpireDate,
      },
    });

    return NextResponse.json(member);

  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Error al crear miembro" },
      { status: 500 }
    );
  }
}