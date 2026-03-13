"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gymName, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registro exitoso");
      window.location.href = "/login";
    } else {
      alert(data.error || "Error al registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrar Gimnasio</h1>

        <input
          type="text"
          placeholder="Nombre del gimnasio"
          value={gymName}
          onChange={(e) => setGymName(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700"
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 rounded bg-gray-700"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Registrar
        </button>
      </div>
    </div>
  );
}
