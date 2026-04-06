/*
  Warnings:

  - You are about to drop the `AffiliatedCompany` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AffiliatedCompany";

-- CreateTable
CREATE TABLE "affiliatedCompany" (
    "id" TEXT NOT NULL,
    "logo" TEXT,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "googleMaps" TEXT,
    "titleUz" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "addressUz" TEXT NOT NULL,
    "addressRu" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "descUz" TEXT NOT NULL,
    "descRu" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliatedCompany_pkey" PRIMARY KEY ("id")
);
