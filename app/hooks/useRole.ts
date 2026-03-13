import { useEffect, useState } from "react"

export default function useRole() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    setRole(storedRole)
  }, [])

  return role
}