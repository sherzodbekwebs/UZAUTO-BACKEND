-- CreateTable
CREATE TABLE "Management" (
    "id" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "positionUz" TEXT NOT NULL,
    "positionRu" TEXT NOT NULL,
    "positionEn" TEXT NOT NULL,
    "receptionUz" TEXT NOT NULL,
    "receptionRu" TEXT NOT NULL,
    "receptionEn" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Management_pkey" PRIMARY KEY ("id")
);
