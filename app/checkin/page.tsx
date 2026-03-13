"use client"

import { useState, useEffect } from "react"

export default function CheckinPage() {

    const [query, setQuery] = useState("")
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [lastResult, setLastResult] = useState<any>(null)

    const registerCheckin = async (memberId: string) => {

        const token = localStorage.getItem("token")

        await fetch("/api/checkin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                memberId
            })
        })

    }


    const searchMembers = async (text: string) => {

        const token = localStorage.getItem("token")

        if (!token) return

        setLoading(true)

        try {

            const res = await fetch(`/api/members?search=${text}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            setMembers(data)

            if (data.length > 0) {
                const member = data[0]
                setLastResult(member)

                const active = isActive(member.expiresAt)

                if (active) {

                    const token = localStorage.getItem("token")

                    await fetch("/api/checkin", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            memberId: member.id
                        })
                    })

                }

            } else {
                setLastResult(null)
            }

        } catch (error) {

            console.error(error)

        }

        setLoading(false)

    }

    useEffect(() => {

        if (query.length < 2) {
            setMembers([])
            return
        }

        const timeout = setTimeout(() => {
            searchMembers(query)
        }, 300)

        return () => clearTimeout(timeout)

    }, [query])


    const isActive = (expiresAt: string) => {

        const today = new Date()
        const exp = new Date(expiresAt)

        return exp >= today

    }

    return (

        <div className="p-10 text-white">

            <h1 className="text-3xl font-bold mb-6">
                Check-in
            </h1>

            <input
                placeholder="Buscar miembro..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="p-3 text-black rounded w-[350px]"
            />

            {lastResult && (

                <div
                    className={`mt-6 p-6 rounded text-center text-4xl font-bold ${isActive(lastResult.expiresAt)
                        ? "bg-green-600"
                        : "bg-red-600"
                        }`}
                >

                    {isActive(lastResult.expiresAt)
                        ? "🟢 ACCESO PERMITIDO"
                        : "🔴 MEMBRESÍA VENCIDA"}

                </div>

            )}

            {loading && (
                <p className="mt-4 text-sm text-gray-400">
                    Buscando...
                </p>
            )}

            <div className="space-y-3 mt-6">

                {members.map((m) => {

                    const active = isActive(m.expiresAt)

                    return (

                        <div
                            key={m.id}
                            className={`p-4 rounded flex justify-between items-center ${active ? "bg-green-700" : "bg-red-700"
                                }`}
                        >

                            <div>
                                <p className="font-bold text-lg">
                                    {m.name}
                                </p>

                                <p className="text-sm">
                                    Vence: {new Date(m.expiresAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-xl font-bold">
                                {active ? "✅ ACTIVO" : "❌ VENCIDO"}
                            </div>

                        </div>

                    )

                })}

            </div>
            {members.length === 0 && query.length > 2 && !loading && (
                <p className="text-gray-400 mt-4">
                    No se encontraron miembros
                </p>
            )}

        </div>

    )

}