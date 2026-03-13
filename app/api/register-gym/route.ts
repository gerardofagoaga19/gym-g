import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {

    try {

        const body = await req.json()
        const { name, email, password } = body

        const hashedPassword = await bcrypt.hash(password, 10)

        console.log("REGISTER DATA:", body)

        const gym = await prisma.gym.create({
            data: {
                name,
                priceDay: 50,
                priceMonth: 500,
                priceYear: 5000,
                pricePromo: 0
            }
        })

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "OWNER",
                gymId: gym.id
            }
        })

        // 🔥 Crear TRIAL automático de 30 días

        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 30);

        await prisma.subscription.create({
            data: {
                gymId: gym.id,
                plan: "trial",
                status: "active",
                expiresAt: trialEnd,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Gimnasio creado correctamente"
        })

    } catch (error) {

        console.error("REGISTER ERROR:", error)

        return NextResponse.json({
            success: false,
            message: "Error al crear gimnasio"
        })

    }

}