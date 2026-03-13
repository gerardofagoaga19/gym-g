/*
  Warnings:

  - You are about to alter the column `priceDay` on the `Gym` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `priceMonth` on the `Gym` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `pricePromo` on the `Gym` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `priceYear` on the `Gym` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "address" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "priceDay" DROP DEFAULT,
ALTER COLUMN "priceDay" SET DATA TYPE INTEGER,
ALTER COLUMN "priceMonth" DROP DEFAULT,
ALTER COLUMN "priceMonth" SET DATA TYPE INTEGER,
ALTER COLUMN "pricePromo" DROP DEFAULT,
ALTER COLUMN "pricePromo" SET DATA TYPE INTEGER,
ALTER COLUMN "priceYear" DROP DEFAULT,
ALTER COLUMN "priceYear" SET DATA TYPE INTEGER;
