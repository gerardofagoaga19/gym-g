import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

function getUserFromToken(req: Request) {

  const auth = req.headers.get("authorization")

  if (!auth) return null

  const token = auth.split(" ")[1]

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any

    return decoded

  } catch {
    return null
  }
}

export async function GET(req: Request) {

  const user = getUserFromToken(req)

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const gym = await prisma.gym.findUnique({
    where: {
      id: user.gymId
    }
  })

  return NextResponse.json(gym)

}
