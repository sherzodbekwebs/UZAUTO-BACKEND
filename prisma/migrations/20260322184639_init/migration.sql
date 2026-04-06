-- CreateTable
CREATE TABLE "Dealer" (
    "id" TEXT NOT NULL,
    "regionUz" TEXT NOT NULL,
    "regionRu" TEXT NOT NULL,
    "regionEn" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "link" TEXT,
    "nameUz" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "addressUz" TEXT NOT NULL,
    "addressRu" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);
