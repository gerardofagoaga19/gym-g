export function isOwner(role: string | null) {
  return role === "OWNER"
}

export function isStaff(role: string | null) {
  return role === "STAFF"
}