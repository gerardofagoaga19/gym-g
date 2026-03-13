"use client";

import { useRouter } from "next/navigation";

export default function SubscriptionExpired() {

    const router = useRouter();

    function retry() {
        router.push("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center max-w-md shadow-2xl">

                <h1 className="text-3xl font-bold mb-4">
                    Suscripción vencida
                </h1>

                <p className="text-gray-400 mb-6">
                    Tu suscripción de <strong>GYM-G</strong> ha vencido.
                </p>

                <p className="text-xl font-semibold mb-6">
                    $999 MXN / mes
                </p>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-gray-300 mb-6 text-center">

                    <p className="mb-4">
                        Realiza tu pago por transferencia y envía tu comprobante.
                    </p>

                    <div className="space-y-1 text-sm">
                        <p><strong>Banco:</strong> BBVA</p>
                        <p><strong>Titular:</strong> Gerardo Canseco</p>
                        <p><strong>Tarjeta:</strong> 4152 3142 0258 6478</p>
                        <p><strong>Concepto:</strong> Suscripción Nombre_del_Gimnasio</p>
                    </div>

                </div>

                <div className="flex gap-4 justify-center">

                    <button
                        onClick={retry}
                        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Reintentar
                    </button>

                    <button
                        onClick={() => window.location.href = "/billing"}
                        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Enviar comprobante
                    </button>

                </div>

            </div>

        </div>
    );
}