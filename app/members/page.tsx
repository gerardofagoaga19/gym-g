"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function MembersPageContent() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const filterParam = searchParams.get("filter") || "all"

    const [members, setMembers] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<
        "all" | "active" | "expired" | "inactive" | "expiring"
    >("all")

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {

        const token = localStorage.getItem("token")

        const res = await fetch("/api/members", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        setMembers(data)

    }

    const filteredMembers = members
        .filter((m) => {

            if (!search) return true

            return (
                m.name?.toLowerCase().includes(search.toLowerCase()) ||
                m.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                m.lastName?.toLowerCase().includes(search.toLowerCase())
            )

        })
        .filter((m) => {

            if (filter === "all") return true

            if (filter === "active") {
                return m.isActive && new Date(m.expiresAt) >= new Date()
            }
            if (filter === "expired") {
                return new Date(m.expiresAt) < new Date()
            }

            if (filter === "expiring") {

                const today = new Date()
                const sevenDays = new Date()
                sevenDays.setDate(today.getDate() + 7)

                const expires = new Date(m.expiresAt)

                return expires > today && expires <= sevenDays

            }

            if (filter === "inactive") {

                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

                if (!m.checkins || m.checkins.length === 0) {
                    return false
                }

                const lastCheckin = new Date(m.checkins[0].createdAt)

                return lastCheckin < sevenDaysAgo

            }

            return true

        })

    return (

        <div className="p-10">

            {/* BOTON VOLVER */}

            <button
                onClick={() => router.push("/dashboard")}
                className="mb-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
                ← Volver al Dashboard
            </button>

            <h1 className="text-2xl font-bold mb-6">
                Miembros
            </h1>

            <div className="mb-6 flex justify-end">

                <button
                    onClick={() => router.push("/members/create")}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >

                    + Agregar miembro

                </button>

            </div>

            {/* BUSCADOR */}

            <input
                placeholder="Buscar miembro..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700"
            />

            {/* FILTROS */}

            <div className="flex gap-3 mb-6">

                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600" : "bg-gray-700"}`}
                >
                    Todos
                </button>

                <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-2 rounded-lg ${filter === "active" ? "bg-green-600" : "bg-gray-700"}`}
                >
                    Activos
                </button>

                <button
                    onClick={() => setFilter("expired")}
                    className={`px-4 py-2 rounded-lg ${filter === "expired" ? "bg-red-600" : "bg-gray-700"}`}
                >
                    Vencidos
                </button>

                <button
                    onClick={() => setFilter("inactive")}
                    className={`px-4 py-2 rounded-lg ${filter === "inactive" ? "bg-yellow-600" : "bg-gray-700"}`}
                >
                    Inactivos
                </button>

                <button
                    onClick={() => setFilter("expiring")}
                    className={`px-4 py-2 rounded-lg ${filter === "expiring" ? "bg-purple-600" : "bg-gray-700"}`}
                >
                    Por vencer
                </button>

            </div>

            {/* LISTA */}

            <div className="space-y-3">

                {filteredMembers.map((member) => {

                    let lastVisit = "Sin visitas"

                    if (member.checkins && member.checkins.length > 0) {
                        lastVisit = new Date(member.checkins[0].createdAt).toLocaleDateString()
                    }

                    const isExpired = new Date(member.expiresAt) < new Date()

                    const daysLeft = Math.ceil(
                        (new Date(member.expiresAt).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )

                    return (

                        <div
                            key={member.id}
                            onClick={() => router.push(`/members/${member.id}`)}
                            className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 flex justify-between"
                        >

                            <div>

                                <div className="font-semibold">
                                    {member.name}
                                </div>

                                <div className="text-sm opacity-70">
                                    Última visita: {lastVisit}
                                </div>

                                {!isExpired && daysLeft > 0 && (
                                    <div className="text-sm text-purple-400">
                                        Vence en {daysLeft} días
                                    </div>
                                )}

                            </div>

                            <div className="text-sm">

                                {isExpired ? (
                                    <span className="text-red-400">
                                        Vencido
                                    </span>
                                ) : member.isActive ? (
                                    <span className="text-green-400">
                                        Activo
                                    </span>
                                ) : (
                                    <span className="text-yellow-400">
                                        Inactivo
                                    </span>
                                )}

                            </div>

                        </div>

                    )

                })}

            </div>

        </div>

    )

}

export default function MembersPage() {
    return (
        <Suspense fallback={<div className="p-10">Cargando miembros...</div>}>
            <MembersPageContent />
        </Suspense>
    )
}