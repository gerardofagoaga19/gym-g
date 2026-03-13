import { prisma } from "@/lib/prisma";

export async function checkSubscription(gymId: string) {
  try {

    const subscription = await prisma.subscription.findFirst({
      where: {
        gymId: gymId,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!subscription) {
      return false;
    }

    const now = new Date();

    const expires = new Date(subscription.expiresAt);

    if (subscription.status !== "active") {
      return false;
    }

    if (expires.getTime() < now.getTime()) {
      return false;
    }

    return true;

  } catch (error) {
    console.error("Subscription check error:", error);
    return false;
  }
}