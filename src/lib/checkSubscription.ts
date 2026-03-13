import { prisma } from "@/lib/prisma";

export async function checkSubscription(gymId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      gymId,
    },
  });

  if (!subscription) {
    return false;
  }

  // 🔥 Si está cancelada o expired
  if (subscription.status !== "active") {
    return false;
  }

  // 🔥 Si ya pasó la fecha
  if (subscription.expiresAt < new Date()) {
    return false;
  }

  return true;
}