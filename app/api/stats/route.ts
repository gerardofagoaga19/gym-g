import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";


// 🔐 Obtener usuario desde el token
async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { userId: string; gymId: string };

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        return user;
    } catch {
        return null;
    }
}


// 📊 GET STATS
export async function GET(req: Request) {
    try {

        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const gymId = user.gymId;
        const now = new Date();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todayCheckins = await prisma.checkin.count({
            where: {
                gymId,
                createdAt: {
                    gte: startOfToday
                }
            }
        });


        // 🔔 ALERTAS AUTOMÁTICAS

        const inFiveDays = new Date();
        inFiveDays.setDate(now.getDate() + 5);


        // 🔴 Miembros vencidos
        const expiredMembers = await prisma.member.count({
            where: {
                gymId,
                isActive: true,
                expiresAt: {
                    lt: now,
                },
            },
        });


        // 🟡 Miembros por vencer
        const expiringSoonMembers = await prisma.member.count({
            where: {
                gymId,
                isActive: true,
                expiresAt: {
                    gte: now,
                    lte: inFiveDays,
                },
            },
        });


        // 📅 Inicio del mes
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );


        // 💰 Ingresos del mes
        const totalRevenueMonth = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                gymId,
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });


        // 💰 Ingresos de hoy


        const totalRevenueToday = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                gymId,
                createdAt: {
                    gte: startOfToday,
                },
            },
        });


        // 👥 MIEMBROS

        const totalMembers = await prisma.member.count({
            where: {
                gymId,
                isActive: true,
            },
        });


        const activeMembers = await prisma.member.count({
            where: {
                gymId,
                isActive: true,
                expiresAt: {
                    gte: now,
                },
            },
        });


        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const expiringSoon = await prisma.member.count({
            where: {
                gymId,
                isActive: true,
                expiresAt: {
                    gte: now,
                    lte: nextWeek,
                },
            },
        });


        // 📊 Ingresos últimos 7 días

        const last7Days = new Date();
        last7Days.setDate(now.getDate() - 6);
        last7Days.setHours(0, 0, 0, 0);


        const payments = await prisma.payment.findMany({
            where: {
                gymId,
                createdAt: {
                    gte: last7Days,
                },
            },
            select: {
                amount: true,
                createdAt: true,
            },
        });


        const dailyMap: Record<string, number> = {};

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);

            const key = date.toISOString().split("T")[0];
            dailyMap[key] = 0;
        }


        payments.forEach((p: { amount: number; createdAt: Date }) => {
            const key = p.createdAt.toISOString().split("T")[0];

            if (dailyMap[key] !== undefined) {
                dailyMap[key] += p.amount;
            }
        });


        const dailyRevenue = Object.entries(dailyMap)
            .map(([date, total]) => ({
                date,
                total,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // ⚠ Miembros que no han venido en 7 días
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(now.getDate() - 7)

        const inactiveMembers = await prisma.member.count({
            where: {
                gymId,
                isActive: true,
                checkins: {
                    none: {
                        createdAt: {
                            gte: sevenDaysAgo
                        }
                    }
                }
            }
        })
        return NextResponse.json({
            revenueMonth: totalRevenueMonth._sum.amount ?? 0,
            revenueToday: totalRevenueToday._sum.amount ?? 0,
            totalMembers,
            activeMembers,
            expiredMembers,
            expiringSoonMembers,
            expiringSoon,
            dailyRevenue,
            todayCheckins,
            inactiveMembers,
        });



    } catch (error) {

        console.error("Stats error:", error);

        return NextResponse.json(
            { error: "Error al obtener estadísticas" },
            { status: 500 }
        );
    }

}



