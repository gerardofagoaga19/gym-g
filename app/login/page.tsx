"use client";

import { useState } from "react";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("gymId", data.gymId);

        document.cookie = `token=${data.token}; path=/`

        alert("Login correcto");

        window.location.href = "/dashboard";

      } else {

        alert(data.message || "Credenciales incorrectas");

      }

    } catch (error) {

      console.error("Error login:", error);
      alert("Error del servidor");

    }

    setLoading(false);
  };

  return (

    <div style={{ padding: 40 }}>

      <h1>Login GYM-G</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Iniciar sesión"}
      </button>

    </div>

  );

}
