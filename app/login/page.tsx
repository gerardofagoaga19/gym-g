"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const emailRef = useRef<HTMLInputElement>(null)

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  useEffect(()=>{
    if(emailRef.current){
      emailRef.current.focus()
    }
  },[])

  const login = async () => {

    setLoading(true)
    setError("")

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

      setError(data.error || "Email o contraseña incorrectos")

    }

    setLoading(false)

  }

  return(

<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">

{/* FONDO DECORATIVO */}

<div className="absolute w-[800px] h-[800px] bg-green-500/20 blur-[200px] rounded-full top-[-200px] left-[-200px]" />
<div className="absolute w-[800px] h-[800px] bg-blue-500/20 blur-[200px] rounded-full bottom-[-200px] right-[-200px]" />

{/* FORM LOGIN */}

<form
onSubmit={(e)=>{
e.preventDefault()
login()
}}
className="relative z-10 backdrop-blur-xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl p-10 w-[420px]"
>

{/* LOGO */}

<div className="text-center mb-8">

<h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
GYM-G
</h1>

<p className="text-gray-400 text-sm mt-2">
Sistema inteligente para administrar gimnasios
</p>

</div>

{/* ERROR */}

{error && (

<div className="mb-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm text-center">
{error}
</div>

)}

{/* EMAIL */}

<div className="mb-5">

<label className="text-sm text-gray-400">
Email
</label>

<input
ref={emailRef}
type="email"
placeholder="tu@email.com"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className={`w-full mt-2 p-3 rounded-lg bg-slate-800 border focus:outline-none transition ${
error ? "border-red-500" : "border-slate-700 focus:border-green-400"
}`}
/>

</div>

{/* PASSWORD */}

<div className="mb-7">

<label className="text-sm text-gray-400">
Password
</label>

<input
type="password"
placeholder="••••••••"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className={`w-full mt-2 p-3 rounded-lg bg-slate-800 border focus:outline-none transition ${
error ? "border-red-500" : "border-slate-700 focus:border-green-400"
}`}
/>

</div>

{/* BOTON LOGIN */}

<button
type="submit"
disabled={loading}
className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
>

{loading ? "Entrando..." : "Iniciar sesión"}

</button>

{/* REGISTER */}

<div className="text-center mt-6 text-sm text-gray-400">

¿Aún no registras tu gimnasio?

<button
type="button"
onClick={()=>router.push("/register-gym")}
className="text-green-400 ml-1 hover:underline"
>
Crear gimnasio
</button>

</div>

</form>

</div>

  )

}
