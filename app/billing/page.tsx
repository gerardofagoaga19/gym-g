"use client";

import { useState } from "react";

export default function Billing() {
  const [loading, setLoading] = useState(false);

  const renewSubscription = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch("/api/renew-subscription", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Error al renovar suscripción");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-10 rounded-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">
          Renovar Suscripción
        </h1>

        <p className="text-gray-400 mb-6">
          Plan Pro - $500 MXN / Mes
        </p>

        <button
          onClick={renewSubscription}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Procesando..." : "Pagar y Activar"}
        </button>
      </div>
    </div>
  );
}