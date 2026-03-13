const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {

  await prisma.subscription.updateMany({
    data: {
      status: "ACTIVE",
      expiresAt: new Date("2026-12-31")
    }
  })

  console.log("Suscripción reactivada correctamente")

}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })