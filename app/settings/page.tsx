"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {

    const [priceDay, setPriceDay] = useState<string>("")
    const [priceMonth, setPriceMonth] = useState<string>("")
    const [priceYear, setPriceYear] = useState<string>("")
    const [pricePromo, setPricePromo] = useState<string>("")
    const router = useRouter()

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    useEffect(() => {
        fetch("/api/gym/prices", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setPriceDay(data.priceDay)
                setPriceMonth(data.priceMonth)
                setPriceYear(data.priceYear)
                setPricePromo(data.pricePromo)
            })
    }, [])

    const savePrices = async () => {

        await fetch("/api/gym/prices", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                priceDay: Number(priceDay),
                priceMonth: Number(priceMonth),
                priceYear: Number(priceYear),
                pricePromo: Number(pricePromo)
            })
        })

        alert("Precios actualizados")
    }

    return (
        <div className="p-10 text-white">
            <button
                onClick={() => router.push("/dashboard")}
                className="mb-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition hover:scale-105"
            >
                ← Volver al menú principal
            </button>

            <h1 className="text-3xl font-bold mb-8">
                Configuración de precios
            </h1>

            <div className="space-y-4 max-w-md">

                <input
                    type="number"
                    value={priceDay}
                    onChange={(e) => setPriceDay(e.target.value)}
                    onBlur={() => setPriceDay(String(Number(priceDay)))}
                    placeholder="Precio día"
                    className="w-full p-3 rounded bg-slate-800"
                />

                <input
                    type="number"
                    value={priceMonth}
                    onChange={(e) => setPriceMonth(e.target.value)}
                    onBlur={() => setPriceMonth(String(Number(priceMonth)))}
                    placeholder="Precio mes ($)"
                    className="w-full p-3 rounded bg-slate-800"
                />

                <input
                    type="number"
                    value={priceYear}
                    onChange={(e) => setPriceYear(e.target.value)}
                    onBlur={() => setPriceYear(String(Number(priceYear)))}
                    placeholder="Precio año"
                    className="w-full p-3 rounded bg-slate-800"
                />

                <input
                    type="number"
                    value={pricePromo}
                    onChange={(e) => setPricePromo(e.target.value)}
                    onBlur={() => setPricePromo(String(Number(pricePromo)))}
                    placeholder="Precio promo"
                    className="w-full p-3 rounded bg-slate-800"
                />

                <button
                    onClick={savePrices}
                    className="bg-green-500 px-6 py-3 rounded-lg"
                >
                    Guardar precios
                </button>

            </div>

        </div>
    )
}