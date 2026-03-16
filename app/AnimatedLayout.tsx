"use client"

import { useRouter } from "next/navigation"
import { Users, CreditCard, Settings, User, LayoutDashboard } from "lucide-react"

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter()

    return (

        <div className="flex min-h-screen bg-gray-900 text-white">

            {/* SIDEBAR */}

            <div className="w-60 bg-gray-950 p-6 flex flex-col">

                <h1 className="text-xl font-bold mb-8">
                    GYM-G
                </h1>

                <nav className="space-y-3 text-sm">

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-2 hover:text-white text-gray-400"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>

                    <button
                        onClick={() => router.push("/members")}
                        className="flex items-center gap-2 hover:text-white text-gray-400"
                    >
                        <Users size={18} />
                        Miembros
                    </button>

                    <button
                        onClick={() => router.push("/payments")}
                        className="flex items-center gap-2 hover:text-white text-gray-400"
                    >
                        <CreditCard size={18} />
                        Pagos
                    </button>

                    <button
                        onClick={() => router.push("/checkin")}
                        className="block w-full text-left hover:text-white text-gray-400"
                    >
                        Checkin
                    </button>

                    <button
                        onClick={() => router.push("/staff")}
                        className="flex items-center gap-2 hover:text-white text-gray-400"
                    >
                        <User size={18} />
                        Empleados
                    </button>

                </nav>

                <div className="mt-auto">

                    <button
                        onClick={() => {
                            localStorage.removeItem("token")
                            router.push("/login")
                        }}
                        className="text-red-400 text-sm"
                    >
                        Cerrar sesión
                    </button>

                </div>

            </div>

            {/* CONTENIDO */}

            <div className="flex-1 p-10">

                {children}

            </div>

        </div>

    )

}