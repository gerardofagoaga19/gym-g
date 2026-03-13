"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CardGradient from "./CardGradient"
import useRole from "../hooks/useRole"
import { isOwner } from "../lib/permissions"
import { Suspense } from "react"


type CardColor = "emerald" | "blue" | "slate" | "green" | "red" | "yellow"

interface CardGradientProps {
  title: string
  value: number
  color: CardColor
  delay?: number
}

function DashboardContent() {
  const [members, setMembers] = useState<any[]>([]);
  const [inactiveMembers, setInactiveMembers] = useState(0)
  const [expiringMembers, setExpiringMembers] = useState(0)
  const [renewalsThisWeek, setRenewalsThisWeek] = useState(0)
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    revenueMonth: 0,
    revenueToday: 0,
    todayCheckins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "expiring">("all");
  const [search, setSearch] = useState("")
  const router = useRouter();
  const role = useRole()
  const owner = isOwner(role)
  const searchParams = useSearchParams();
  const [gym, setGym] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<
    "DAY" | "MONTH" | "YEAR" | "PROMO" | null
  >(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const cardStyle: React.CSSProperties = {


    background: "#1f1f1f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    color: "white"
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "10px"
  };

  useEffect(() => {
    const section = document.getElementById("members-section");

    if (section) {
      setTimeout(() => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [searchParams]);

  useEffect(() => {
    const filter = searchParams.get("filter");

    if (!filter) return;

    const section = document.getElementById("members-section");

    if (section) {
      setTimeout(() => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [searchParams]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login";
      return;
    }
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchMembers();
      fetchStats();
      fetchPayments();
      fetchGym();
    }
  }, [token]);

  const fetchMembers = async () => {
    if (!token) return;

    const res = await fetch("/api/members", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 Si la suscripción está vencida → redirigir
    if (res.status === 403) {
      window.location.href = "/subscription-expired";
      return;
    }

    // 🔐 Si no autorizado
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();

    // 🔥 Seguridad extra
    if (!Array.isArray(data)) {
      console.error("La respuesta no es un array:", data);
      return;
    }

    setMembers(data);
    const today = new Date()

    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(today.getDate() - 10)

    const inactive = data.filter((m: any) => {

      if (!m.checkins || m.checkins.length === 0) {
        return true
      }

      const lastVisit = new Date(m.checkins[0].createdAt)

      return lastVisit < tenDaysAgo
    })

    setInactiveMembers(inactive.length)


    const sevenDays = new Date()
    sevenDays.setDate(today.getDate() + 7)

    const expiring = data.filter((m: any) => {

      const expires = new Date(m.expiresAt)

      return expires > today && expires <= sevenDays
    })

    setExpiringMembers(expiring.length)
    const renewals = data.filter((m: any) => {

      const expires = new Date(m.expiresAt)

      return expires > today && expires <= sevenDays
    })

    setRenewalsThisWeek(renewals.length)
  };


  const fetchStats = async () => {
    if (!token) return;

    setLoading(true);

    const res = await fetch("/api/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setStats({
      ...data,
      revenueMonth: Number(data.revenueMonth),
      revenueToday: Number(data.revenueToday),
      todayCheckins: Number(data.todayCheckins ?? 0),
    });

    setLoading(false);
  };

  const fetchPayments = async () => {
    if (!token) return;
    const res = await fetch("/api/payments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPayments(await res.json());
  };

  const createMember = async (
    planType: "DAY" | "MONTH" | "YEAR" | "PROMO"
  ) => {
    if (!token || !name) return;

    await fetch("/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, planType }),
    });

    setName("");
    setSelectedPlan(null);

    fetchMembers();
    fetchStats();
    fetchPayments();
  };

  const deleteMember = async (id: string) => {
    if (!token) return false;

    const res = await fetch(`/api/members/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el miembro");
      return false;
    }

    await fetchMembers();
    await fetchStats();

    return true;
  };
  const fetchGym = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch("/api/gym", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    // Guardamos el gimnasio
    setGym(data)

  }

  const renewMember = async (
    memberId: string,
    planType: "DAY" | "MONTH" | "YEAR" | "PROMO"
  ) => {
    if (!token) return;

    let amount = 0;
    if (planType === "DAY") amount = 50;
    if (planType === "MONTH") amount = 500;
    if (planType === "YEAR") amount = 5000;
    if (planType === "PROMO") amount = 300;

    await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        memberId,
        amount,
        planType,
        method: "EFECTIVO",
      }),
    });

    setSuccessMessage("Pago registrado correctamente ✅");
    setTimeout(() => setSuccessMessage(""), 2500);

    fetchMembers();
    fetchStats();
    fetchPayments();
  };



  const now = new Date();

  const activeMembers = members.filter(
    (m) => m.isActive
  );

  const expiredMembers = members.filter(
    (m) => !m.isActive
  );

  const expiringSoonMembers = members.filter((m) => {
    const exp = new Date(m.expiresAt);
    const fiveDays = new Date();
    fiveDays.setDate(now.getDate() + 5);

    return exp > now && exp <= fiveDays;
  });

  const filteredMembers = members
    .filter((member) => {
      const inFiveDays = new Date();
      inFiveDays.setDate(now.getDate() + 5);

      if (filter === "active") return new Date(member.expiresAt) > now;

      if (filter === "expired") return new Date(member.expiresAt) <= now;

      if (filter === "expiring") {
        const exp = new Date(member.expiresAt);
        return exp >= now && exp <= inFiveDays;
      }

      return true;
    })
    .filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    )


  return (

    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900/70 backdrop-blur-xl border-r border-slate-700 p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-10">
            {gym?.name || "Mi gimnasio"}
          </h2>

          <nav className="space-y-4 text-gray-400 text-sm">
            <button
              onClick={() => router.push("/dashboard")}
              className="mb-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              ← Menú principal
            </button>
            <button
              onClick={() => router.push("/members")}
              className="block w-full text-left hover:text-white transition hover:translate-x-1"
            >
              👥 Miembros
            </button>
            <button
              onClick={() => router.push("/payments")}
              className="block w-full text-left hover:text-white transition hover:translate-x-1"
            >
              💳 Pagos
            </button>
            {owner && (
              <button
                onClick={() => router.push("/settings")}
                className="block w-full text-left hover:text-white transition hover:translate-x-1"
              >
                ⚙ Precios
              </button>
            )}
            {owner && (
              <button
                onClick={() => router.push("/staff")}
                className="block w-full text-left hover:text-white transition hover:translate-x-1"
              >
                👥 Empleados
              </button>
            )}
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 hover:bg-red-600 py-2 rounded-lg transition hover:scale-105"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)] 
  animate-[fadeIn_.6s_ease-in-out]">


        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            {gym && (
              <div className="flex items-center gap-4 mb-4">

                {gym.logo && (
                  <img
                    src={gym.logo}
                    alt="Logo del gimnasio"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                  />
                )}

                <div>
                  <p className="text-xs text-gray-500 tracking-widest uppercase">
                    {gym.name}
                  </p>
                </div>

              </div>
            )}

            <h1 className="title-dashboard">
              {gym?.name || "Mi gimnasio"}
            </h1>
          </div>

          <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm">
            Admin
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {/* GRÁFICO */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-10 shadow-inner">
          <div className="flex justify-between mb-6">
            <p className="text-gray-400 text-sm">
              Ingresos últimos 7 días
            </p>

          </div>

          <div className="relative h-48 flex items-end gap-4">
            <div className="absolute bottom-0 left-0 w-full h-px bg-slate-700"></div>

            {stats?.dailyRevenue?.map((day: any, i: number) => {
              const max = Math.max(
                ...stats.dailyRevenue.map((d: any) => d.total)
              );

              const height =
                max === 0 ? 5 : (day.total / max) * 100;

              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-emerald-600 via-green-400 to-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/40 transition-all duration-500 hover:scale-105"
                  style={{ height: `${height}%` }}
                  title={`${day.date} - $${day.total}`}
                />
              );
            })}
          </div>
        </div>

        {/* TARJETAS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-8 mb-12 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-3xl bg-slate-800/60 border border-slate-700/50"
              />
            ))}
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-8 mb-12 auto-rows-fr">



            {/* 🔔 ALERTAS VISUALES */}
            <div className="mb-8 space-y-4">

              {/* ALERTA MIEMBROS VENCIDOS */}
              {expiredMembers.length > 0 && (
                <div className="bg-gradient-to-r from-red-900/50 to-red-800/30 border border-red-600 text-red-200 px-5 py-4 rounded-2xl shadow-lg flex items-center justify-between">

                  <div>
                    <p className="text-sm opacity-80">Miembros vencidos</p>
                    <p className="text-lg font-semibold">
                      🔴 {expiredMembers.length} miembro(s) tienen su membresía vencida
                    </p>
                  </div>

                </div>
              )}

              {/* TARJETA ENTRADAS HOY */}
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 border border-blue-600/40 rounded-2xl p-6 shadow-lg">

                <p className="text-sm opacity-80">Entradas hoy</p>

                <p className="text-3xl font-bold mt-1">
                  {stats?.todayCheckins ?? 0}
                </p>

              </div>

              {/* TARJETA CLIENTES INACTIVOS */}
              <div
                onClick={() => router.push("/members?filter=inactive")}
                className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/30 border border-yellow-500/40 rounded-2xl p-6 cursor-pointer shadow-lg hover:scale-[1.02] transition"
              >

                <p className="text-sm opacity-80">Clientes inactivos</p>

                <p className="text-2xl font-bold mt-1">
                  {inactiveMembers}
                </p>

              </div>

              {/* ALERTA INACTIVOS */}
              <div className="bg-yellow-900/30 border border-yellow-600/40 rounded-xl px-4 py-3 text-yellow-200 shadow">

                ⚠ {inactiveMembers} clientes no han venido en 10 días

              </div>

              {/* ALERTA MEMBRESÍAS POR VENCER */}
              <div className="bg-purple-900/30 border border-purple-600/40 rounded-xl px-4 py-3 text-purple-200 shadow">

                ⚠ {expiringMembers} membresías vencen en 7 días

              </div>

              {/* ALERTA RENOVACIONES */}
              <div className="bg-green-900/30 border border-green-600/40 rounded-xl px-4 py-3 text-green-200 shadow">

                💰 {renewalsThisWeek} renovaciones posibles esta semana

              </div>

              {/* ALERTA PRÓXIMOS A VENCER */}
              {expiringSoonMembers.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/30 border border-yellow-600 text-yellow-200 px-5 py-4 rounded-2xl shadow-lg flex items-center justify-between">

                  <div>
                    <p className="text-sm opacity-80">Próximos a vencer</p>

                    <p className="text-lg font-semibold">
                      🟡 {expiringSoonMembers.length} miembro(s) vencen en los próximos 5 días
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFilter("expiring");
                      router.push("/dashboard?filter=expiring");

                      setTimeout(() => {
                        const section = document.getElementById("members-section");
                        if (section) {
                          section.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }, 500);
                    }}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:scale-105 transition shadow-md"
                  >
                    Ver miembros
                  </button>

                </div>
              )}

            </div>
            {/* INGRESOS MES */}
            <CardGradient
              title="Ingresos del Mes"
              value={stats.revenueMonth}
              color="emerald"
              isCurrency
            />

            <CardGradient
              title="Ingresos Hoy"
              value={stats.revenueToday}
              color="blue"
              isCurrency
            />

            {/* MIEMBROS */}
            <CardGradient
              title="Miembros Totales"
              value={members.length}
              color="slate"
            />

            {/* ACTIVOS */}
            <div
              onClick={() => {
                setFilter("active");
                router.push("/dashboard?filter=active");
              }}
              className={`cursor-pointer transition transform ${filter === "active"
                ? "scale-105 ring-2 ring-green-400"
                : "hover:scale-102"
                }`}
            >
              <CardGradient
                title="Activos"
                value={activeMembers.length}
                color="green"
              />
            </div>

            {/* VENCIDOS */}
            <div
              onClick={() => {
                setFilter("expired");
                router.push("/dashboard?filter=expired");
              }}
              className={`cursor-pointer transition transform ${filter === "expired"
                ? "scale-105 ring-2 ring-red-400"
                : "hover:scale-102"
                }`}
            >
              <CardGradient
                title="Vencidos"
                value={expiredMembers.length}
                color="red"
              />
            </div>

            {/* POR VENCER */}
            <div
              onClick={() => {
                setFilter("expiring");
                router.push("/dashboard?filter=expiring");
              }}
              className={`cursor-pointer transition transform ${filter === "expiring"
                ? "scale-105 ring-2 ring-yellow-400"
                : "hover:scale-102"
                }`}
            >
              <CardGradient
                title="Por Vencer"
                value={expiringSoonMembers.length}
                color="yellow"
              />
            </div>

          </div>
        )}

        {/* INPUT */}
        <div className="flex gap-3 mb-8">
          <input
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none"
            placeholder="Nombre del miembro"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => {
              if (!name) return;
              setSelectedPlan("DAY");
            }}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
          >
            Agregar
          </button>
        </div>

        {/* MIEMBROS */}
        <div className="space-y-4">
          {/* =============================== */}
          {/* 💳 HISTORIAL DE PAGOS */}
          {/* =============================== */}

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              Historial de Pagos
            </h2>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">

              {payments.length === 0 ? (
                <div className="p-6 text-gray-400 text-center">
                  No hay pagos registrados
                </div>
              ) : (
                payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-6 border-b border-slate-700/40 hover:bg-slate-800 transition"
                  >
                    <div>
                      <p className="font-semibold">
                        {payment.member?.name || "Miembro eliminado"}
                      </p>

                      <p className="text-sm text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">

                      {/* Plan */}
                      {/* Plan */}
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                        {payment.planType === "MONTH" && "1 Mes"}
                        {payment.planType === "DAY" && "1 Día"}
                        {payment.planType === "YEAR" && "1 Año"}
                        {payment.planType === "PROMO" && "Promo"}
                      </span>

                      {/* Método */}
                      <span className="text-sm text-gray-400">
                        {payment.method}
                      </span>

                      {/* Monto */}
                      <span className="text-lg font-bold text-emerald-400">
                        + ${payment.amount}
                      </span>

                    </div>
                  </div>
                ))
              )}

            </div>
          </div>
          <div id="members-section"></div>
          <input
            type="text"
            placeholder="Buscar miembro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none"
          />
          {filteredMembers.map((member) => {
            const isActive = member.isActive;

            return (
              <div
                key={member.id}
                onClick={() => router.push(`/members/${member.id}`)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300
    ${isActive
                    ? "bg-slate-800/60 border border-slate-700/50"
                    : "bg-red-900/20 border-2 border-red-500 shadow-lg shadow-red-500/20 animate-pulse"
                  }`}
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-lg">{member.name}</p>
                    {!isActive && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full">
                        ⚠ Membresía vencida
                      </span>
                    )}
                    <p className="text-sm text-gray-400">
                      Vence: {new Date(member.expiresAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {isActive ? "Activo" : "Vencido"}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-400">
                    Selecciona el miembro para administrar su membresía
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-96 shadow-2xl">

            <h3 className="text-xl font-bold mb-6 text-center">
              Seleccionar Plan Inicial
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <button
                onClick={() => createMember("DAY")}
                className="bg-green-500 hover:bg-green-600 py-2 rounded-lg"
              >
                1 Día ($50)
              </button>

              <button
                onClick={() => createMember("MONTH")}
                className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg"
              >
                1 Mes ($500)
              </button>

              <button
                onClick={() => createMember("YEAR")}
                className="bg-purple-500 hover:bg-purple-600 py-2 rounded-lg"
              >
                1 Año ($5000)
              </button>

              <button
                onClick={() => createMember("PROMO")}
                className="bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg"
              >
                Promo ($300)
              </button>

            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
      {memberToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-96 shadow-2xl">

            <h3 className="text-xl font-bold mb-4">
              Confirmar eliminación
            </h3>

            <p className="text-gray-400 mb-6">
              ¿Estás seguro que quieres eliminar este miembro?
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  if (!memberToDelete) return;

                  const id = memberToDelete;

                  // 🔥 Cerrar modal inmediatamente
                  setMemberToDelete(null);

                  try {
                    await deleteMember(id);
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-center hover:scale-[1.03] transition-all duration-300">
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <p className="text-3xl font-bold text-emerald-400">{value}</p>
    </div>
  );
}
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-10">Cargando dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
