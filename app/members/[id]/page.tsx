"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function MemberPage() {

    const { id } = useParams()
    const router = useRouter()

    const [member, setMember] = useState<any>(null)

    useEffect(() => {
        if (id) fetchMember()
    }, [id])

    const fetchMember = async () => {
        try {

            const token = localStorage.getItem("token")

            if (!token) {
                alert("Sesión expirada")
                router.push("/login")
                return
            }

            const res = await fetch(`/api/members/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw new Error("Error cargando miembro")
            }

            const data = await res.json()

            setMember(data)

        } catch (error) {
            console.error(error)
            alert("Error cargando miembro")
        }
    }

    if (!member) {
        return <div className="p-10 text-white">Cargando...</div>
    }

    const renewMembership = async (planType: string) => {

        const token = localStorage.getItem("token")

        let amount = 0

        if (planType === "DAY") amount = 50
        if (planType === "MONTH") amount = 500
        if (planType === "YEAR") amount = 5000
        if (planType === "PROMO") amount = 300

        await fetch("/api/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                memberId: id,
                amount,
                planType,
                method: "EFECTIVO"
            })
        })

        fetchMember()
    }

    const registerCheckin = async () => {

        const token = localStorage.getItem("token")

        const response = await fetch("/api/checkin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                memberId: member.id
            })
        })

        if (response.ok) {
            alert("Entrada registrada correctamente")

            // 🔥 refrescar datos
            fetchMember()

        } else {
            alert("Error registrando entrada")
        }
    }

    return (
        <div className="p-10 text-white">

            <button
                onClick={() => router.back()}
                className="mb-6 bg-slate-700 px-4 py-2 rounded"
            >
                ← Volver
            </button>

            <h1 className="text-3xl font-bold mb-6">
                {member.name}
            </h1>

            <div className="bg-slate-800 p-6 rounded-xl mb-10">
                <p>📞 Teléfono: {member.phone}</p>
                <p>
                    📅 Vence:
                    {" "}
                    {new Date(member.expiresAt).toLocaleDateString()}
                </p>
            </div>

            <div className="mb-8">

                <h2 className="text-xl font-bold mb-4">
                    Renovar membresía
                </h2>

                <div className="flex gap-3 flex-wrap">

                    <button
                        onClick={() => renewMembership("DAY")}
                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                    >
                        1 Día
                    </button>

                    <button
                        onClick={() => renewMembership("MONTH")}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                    >
                        1 Mes
                    </button>

                    <button
                        onClick={() => renewMembership("YEAR")}
                        className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
                    >
                        1 Año
                    </button>

                    <button
                        onClick={() => renewMembership("PROMO")}
                        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
                    >
                        Promo
                    </button>

                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={registerCheckin}
                    >
                        Registrar entrada
                    </button>

                </div>

            </div>

            <h2 className="text-xl font-bold mb-4">
                Historial de pagos
            </h2>

            {member.payments?.length > 0 ? (

                member.payments.map((payment: any) => (

                    <div
                        key={payment.id}
                        className="bg-slate-800 p-4 rounded mb-3 flex justify-between"
                    >

                        <span>
                            {new Date(payment.createdAt).toLocaleDateString()}
                        </span>

                        <span className="font-bold">
                            ${payment.amount}
                        </span>

                    </div>

                ))

            ) : (

                <div className="opacity-70">
                    No hay pagos registrados
                </div>

            )}

            <h2 className="text-xl font-bold mt-10 mb-4">
                Historial de visitas
            </h2>

            <div className="space-y-2">

                {member.checkins && member.checkins.length > 0 ? (

                    member.checkins.map((checkin: any) => {

                        const date = new Date(checkin.createdAt)

                        return (

                            <div
                                key={checkin.id}
                                className="bg-gray-800 p-3 rounded-lg flex justify-between"
                            >

                                <div>
                                    {date.toLocaleDateString()}
                                </div>

                                <div className="opacity-70">
                                    {date.toLocaleTimeString()}
                                </div>

                            </div>

                        )

                    })

                ) : (

                    <div className="opacity-70">
                        No hay visitas registradas
                    </div>

                )}

            </div>

        </div>
    )
}