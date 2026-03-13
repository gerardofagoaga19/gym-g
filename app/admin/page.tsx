"use client"

import { useEffect, useState } from "react"

export default function AdminPage() {

    const [gyms, setGyms] = useState<any[]>([])

    useEffect(() => {
        fetchGyms()
    }, [])

    const fetchGyms = async () => {

  try{

    const token = localStorage.getItem("token")

    const res = await fetch("/api/admin/gyms",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    const data = await res.json()

    console.log("GYMS:", data)

    if(Array.isArray(data)){
      setGyms(data)
    }else if(Array.isArray(data.gyms)){
      setGyms(data.gyms)
    }else{
      setGyms([])
    }

  }catch(error){
    console.error(error)
    setGyms([])
  }

}

    return (

        <div className="p-10 text-white">

            <h1 className="text-3xl font-bold mb-8">
                GYM-G Admin
            </h1>

            <div className="grid grid-cols-3 gap-6">

                {Array.isArray(gyms) && gyms.map((gym) => {

                    return (

                        <div
                            key={gym.id}
                            className="bg-slate-800 p-6 rounded-xl"
                        >

                            <h2 className="text-xl font-bold mb-2">
                                {gym.name}
                            </h2>

                            <p className="text-gray-400">
                                Miembros: {gym.members.length}
                            </p>

                            <p className="text-gray-400">
                                Suscripciones: {gym.subscriptions.length}
                            </p>

                        </div>

                    )

                })}

            </div>

        </div>

    )

}