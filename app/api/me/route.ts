import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkSubscription } from "@/lib/checkSubscription";

export async function GET() {

  const headersList = await headers();

  const userId = headersList.get("x-user-id");
  const gymId = headersList.get("x-gym-id");

  if (!userId || !gymId) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  // 🔥 Revisar suscripción real
  const hasAccess = await checkSubscription(gymId);

  if (!hasAccess) {
    return NextResponse.json(
      { error: "Suscripción vencida" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Acceso autorizado",
    userId,
    gymId
  });

}