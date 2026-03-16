"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function PaymentsPage() {

const router = useRouter()

const [payments,setPayments] = useState<any[]>([])

useEffect(()=>{
fetchPayments()
},[])

const fetchPayments = async () => {

const token = localStorage.getItem("token")

const res = await fetch("/api/payments",{
headers:{
Authorization:`Bearer ${token}`
}
})

const data = await res.json()

setPayments(data)

}

return(

<div className="p-10">

{/* BOTON VOLVER */}

<button
onClick={()=>router.push("/dashboard")}
className="mb-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
>
← Volver al menú principal
</button>

<h1 className="text-2xl font-bold mb-6">
Historial de pagos
</h1>

<div className="space-y-3">

{payments.map((payment)=>{

return(

<div
key={payment.id}
className="bg-gray-800 p-4 rounded-lg flex justify-between"
>

<div>

<div className="font-semibold">
{payment.member?.name}
</div>

<div className="text-sm opacity-70">
{new Date(payment.startDate).toLocaleDateString()}
</div>

</div>

<div className="font-semibold">

MX${payment.amount}

</div>

</div>

)

})}

</div>

</div>

)

}