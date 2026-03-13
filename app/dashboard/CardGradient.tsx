"use client"

import { motion } from "framer-motion"

type CardColor = "emerald" | "blue" | "slate" | "green" | "red" | "yellow"

interface CardGradientProps {
  title: string
  value: number
  color: CardColor
  delay?: number
  isCurrency?: boolean
}

export default function CardGradient({
  title,
  value,
  color,
  delay = 0,
  isCurrency = false,
}: CardGradientProps) {

  const formattedValue = isCurrency
  ? new Intl.NumberFormat("en-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(Number(value))
  : new Intl.NumberFormat("en-MX", {
      maximumFractionDigits: 0,
    }).format(Number(value))

  const colors: Record<CardColor, string> = {
    emerald: "from-emerald-400 via-emerald-500 to-emerald-600",
    blue: "from-blue-400 via-blue-500 to-blue-600",
    slate: "from-slate-400 via-slate-500 to-slate-600",
    green: "from-green-400 via-green-500 to-green-600",
    red: "from-red-400 via-red-500 to-red-600",
    yellow: "from-yellow-400 via-yellow-500 to-yellow-600",
  }

  const glow: Record<CardColor, string> = {
    emerald: "bg-emerald-400/40",
    blue: "bg-blue-400/40",
    slate: "bg-slate-400/40",
    green: "bg-green-400/40",
    red: "bg-red-400/40",
    yellow: "bg-yellow-400/40",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      whileHover={{ scale: 1.05 }}
      className="group relative rounded-3xl p-[1px]"
    >
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors[color]} opacity-80`}
      />

      <div className="relative bg-slate-950/85 backdrop-blur-2xl rounded-3xl p-6 overflow-hidden h-full flex flex-col justify-center min-w-0">

        <div
          className={`absolute -top-20 -right-20 w-60 h-60 ${glow[color]} blur-3xl rounded-full`}
        />

        <p className="text-xs tracking-[0.25em] uppercase font-semibold text-slate-400">
          {title}
        </p>

       <p className="mt-4 font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent
text-2xl sm:text-3xl md:text-4xl leading-tight">
          {formattedValue}
        </p>

      </div>
    </motion.div>
  )
}