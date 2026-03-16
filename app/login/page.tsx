"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const login = async () => {

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if(res.ok){

      localStorage.setItem("token",data.token)
      localStorage.setItem("role",data.role)
      localStorage.setItem("gymId",data.gymId)

      router.push("/dashboard")

    }else{

      alert(data.error || "Error al iniciar sesión")

    }

  }

  return(

  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 w-[420px] shadow-2xl">

      {/* LOGO */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          GYM-G
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Sistema de gestión para gimnasios
        </p>

      </div>

      {/* INPUT EMAIL */}
      <div className="mb-4">

        <label className="text-sm text-gray-400">
          Email
        </label>

        <input
        type="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
        />

      </div>

      {/* INPUT PASSWORD */}
      <div className="mb-6">

        <label className="text-sm text-gray-400">
          Password
        </label>

        <input
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
        />

      </div>

      {/* BOTON LOGIN */}
      <button
      onClick={login}
      className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold transition"
      >
        Iniciar sesión
      </button>

      {/* REGISTER */}
      <div className="text-center mt-6 text-sm text-gray-400">

        ¿No tienes gimnasio registrado?

        <button
        onClick={()=>router.push("/register-gym")}
        className="text-green-400 ml-1 hover:underline"
        >
          Crear uno
        </button>

      </div>

    </div>

  </div>

  )

}
