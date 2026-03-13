import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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

// =====================
// GET PAYMENTS
// =====================
export async function GET(req: Request) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const payments = await prisma.payment.findMany({
      where: {
        gymId: user.gymId,
      },
      include: {
        member: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener pagos" },
      { status: 500 }
    );
  }
}

// =====================
// POST PAYMENT
// =====================
export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { memberId, amount, planType, method } = body;

    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        gymId: user.gymId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Miembro no válido" },
        { status: 403 }
      );
    }

    const today = new Date();

    // 🔥 Si el miembro aún está activo, sumar desde su fecha actual
    let baseDate =
      member.expiresAt && member.expiresAt > today
        ? new Date(member.expiresAt)
        : new Date(today);

    let newExpireDate = new Date(baseDate);

    // ===============================
    // 🔥 LÓGICA REAL SEGÚN PLAN
    // ===============================

    if (planType === "DAY") {
      newExpireDate.setDate(newExpireDate.getDate() + 1);
    }

    if (planType === "MONTH") {
      newExpireDate.setMonth(newExpireDate.getMonth() + 1);
    }

    if (planType === "YEAR") {
      newExpireDate.setFullYear(newExpireDate.getFullYear() + 1);
    }

    if (planType === "PROMO") {
      newExpireDate.setDate(newExpireDate.getDate() + 15);
    }

    // ===============================
    // Guardar pago
    // ===============================
    // 🔥 Obtener precios del gimnasio
 const gym = await prisma.gym.findUnique({
  where: { id: user.gymId }
 }) as any
 const prices = {
  DAY: gym?.priceDay ?? 50,
  MONTH: gym?.priceMonth ?? 500,
  YEAR: gym?.priceYear ?? 5000,
  PROMO: gym?.pricePromo ?? 300
}

 const paymentAmount = prices[planType as keyof typeof prices]
 const payment = await prisma.payment.create({
      data: {
        memberId,
        gymId: user.gymId,
        amount: paymentAmount,
        planType,
        method,
        startDate: today,
        endDate: newExpireDate,
      },
    });

    // ===============================
    // Actualizar expiración miembro
    // ===============================
    await prisma.member.update({
      where: { id: memberId },
      data: {
        expiresAt: newExpireDate,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al registrar pago" },
      { status: 500 }
    );
  }
}