import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {

  // 🔐 verificar token
  const authHeader = req.headers.get("authorization")

  if (!authHeader) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return Response.json({ error: "Token inválido" }, { status: 401 })
  }

  if ((decoded as any).role !== "OWNER") {
    return Response.json(
      { error: "Solo el dueño puede crear empleados" },
      { status: 403 }
    )
  }

  // 👇 si es OWNER sí puede crear empleado
  const { email, password, gymId } = await req.json()

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "STAFF",
      gymId
    }
  })

  return Response.json(user)

}