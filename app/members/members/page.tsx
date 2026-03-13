"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateMemberPage() {

const router = useRouter()

const [name,setName] = useState("")
const [lastName,setLastName] = useState("")
const [secondLastName,setSecondLastName] = useState("")
const [phone,setPhone] = useState("")
const [plan,setPlan] = useState("MONTH")

const createMember = async () => {

const token = localStorage.getItem("token")

const res = await fetch("/api/members",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body: JSON.stringify({
firstName: name,
lastName,
secondLastName,
phone,
planType: plan
})

})

if(res.ok){

alert("Miembro creado correctamente")

router.push("/members")

}else{

alert("Error al crear miembro")

}

}

return (

<div className="max-w-xl mx-auto mt-16 space-y-4">

<h1 className="text-2xl font-bold mb-6">
Registrar miembro
</h1>

<input
placeholder="Nombre"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
/>

<input
placeholder="Apellido paterno"
value={lastName}
onChange={(e)=>setLastName(e.target.value)}
className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
/>

<input
placeholder="Apellido materno"
value={secondLastName}
onChange={(e)=>setSecondLastName(e.target.value)}
className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
/>

<input
placeholder="Teléfono (opcional)"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
/>

<select
value={plan}
onChange={(e)=>setPlan(e.target.value)}
className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
>

<option value="DAY">1 día</option>
<option value="MONTH">1 mes</option>
<option value="YEAR">1 año</option>
<option value="PROMO">Promo</option>

</select>

<button
onClick={createMember}
className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg"
>

Crear miembro

</button>

<button
onClick={()=>router.push("/members")}
className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg"
>

Cancelar

</button>

</div>

)

}