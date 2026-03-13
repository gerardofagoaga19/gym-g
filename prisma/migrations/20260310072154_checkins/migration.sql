-- AlterTable
ALTER TABLE "Gym" ALTER COLUMN "priceDay" SET DEFAULT 50,
ALTER COLUMN "priceMonth" SET DEFAULT 500,
ALTER COLUMN "pricePromo" SET DEFAULT 0,
ALTER COLUMN "priceYear" SET DEFAULT 5000;

-- CreateTable
CREATE TABLE "Checkin" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Checkin_memberId_idx" ON "Checkin"("memberId");

-- CreateIndex
CREATE INDEX "Checkin_gymId_idx" ON "Checkin"("gymId");

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
