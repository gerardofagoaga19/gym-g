-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '30 days';
