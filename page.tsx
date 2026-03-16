"use client"

import { useRouter } from "next/navigation"

export default function HomePage() {

const router = useRouter()

return (

<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

<div className="text-center max-w-xl">

<h1 className="text-5xl font-bold mb-6">
GYM-G
</h1>

<p className="text-gray-400 mb-10 text-lg">
Sistema de administración para gimnasios
</p>

<div className="flex gap-4 justify-center">

<button
onClick={()=>router.push("/login")}
className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
>
Iniciar sesión
</button>

<button
onClick={()=>router.push("/register-gym")}
className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold"
>
Registrar gimnasio
</button>

</div>

</div>

</div>

)

}