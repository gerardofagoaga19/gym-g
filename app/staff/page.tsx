"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if (res.ok) {

      // guardar datos de sesión
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)
      localStorage.setItem("gymId", data.gymId)

      alert("Bienvenido")

      router.push("/dashboard")

    } else {

      alert(data.error || "Error en login")

    }

  }

  return (

    <div className="p-10 text-white">

      <h1 className="text-3xl mb-6">
        Iniciar sesión
      </h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="block mb-3 p-2 bg-gray-800 rounded"
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="block mb-3 p-2 bg-gray-800 rounded"
      />

      <button
        onClick={login}
        className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded"
      >
        Entrar
      </button>

    </div>
  )
}