import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { gymId } = await req.json()

  if (!gymId) {
    return NextResponse.json({ error: "gymId requerido" }, { status: 400 })
  }

  const newDate = new Date()
  newDate.setMonth(newDate.getMonth() + 1)

  await prisma.gym.update({
    where: { id: gymId },
    data: {
      subscriptionExpiresAt: newDate
    }
  })

  return NextResponse.json({ success: true })
}