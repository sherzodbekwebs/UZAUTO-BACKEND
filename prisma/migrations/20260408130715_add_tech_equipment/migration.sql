-- CreateTable
CREATE TABLE "TechEquipment" (
    "id" TEXT NOT NULL,
    "sectionRu" TEXT NOT NULL,
    "sectionUz" TEXT,
    "sectionEn" TEXT,
    "titleRu" TEXT NOT NULL,
    "titleUz" TEXT,
    "titleEn" TEXT,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechEquipment_pkey" PRIMARY KEY ("id")
);
