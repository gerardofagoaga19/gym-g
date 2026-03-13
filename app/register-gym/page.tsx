"use client"

import { useState } from "react"

export default function RegisterGym() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const register = async () => {

    console.log("CLICK EN CREAR GIMNASIO")

    setLoading(true)

    try {

        console.log("Datos enviados:", { name, email, password })

        const res = await fetch("/api/register-gym", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })

        console.log("Respuesta del servidor:", res)

        const data = await res.json()

        console.log("Datos recibidos:", data)

        if (res.ok) {

            alert("Gimnasio creado correctamente")

            window.location.href = "/login"

        } else {

            alert(data.message || "Error al crear gimnasio")

        }

    } catch (error) {

        console.error("ERROR:", error)

        alert("Error del servidor")

    }

    setLoading(false)

}
    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-950">

            <div className="bg-slate-900 p-8 rounded-xl w-[400px]">

                <h1 className="text-2xl font-bold mb-6">
                    Crear gimnasio
                </h1>

                <input
                    placeholder="Nombre del gimnasio"
                    className="w-full mb-3 p-2 rounded bg-slate-800"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    placeholder="Email"
                    className="w-full mb-3 p-2 rounded bg-slate-800"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-6 p-2 rounded bg-slate-800"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={register}
                    className="w-full bg-green-600 p-2 rounded"
                >

                    {loading ? "Creando..." : "Crear gimnasio"}

                </button>

            </div>

        </div>

    )

}