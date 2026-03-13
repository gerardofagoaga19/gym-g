import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {

    const body = await req.json()

    const { name, email, password, gymId } = body

    // 🔎 validar datos
    if (!name || !email || !password || !gymId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      )
    }

    // 🔒 encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gymId
      }
    })

    return NextResponse.json(staff)

  } catch (error) {

    console.error("CREATE STAFF ERROR:", error)

    return NextResponse.json(
      { error: "Error creating staff" },
      { status: 500 }
    )

  }
}