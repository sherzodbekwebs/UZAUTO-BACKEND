/*
  Warnings:

  - You are about to drop the column `advantages` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `specs` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "advantages",
DROP COLUMN "specs";

-- AlterTable
ALTER TABLE "TechSection" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ProductSpec" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "keyRu" TEXT NOT NULL,
    "keyUz" TEXT,
    "keyEn" TEXT,
    "valRu" TEXT NOT NULL,
    "valUz" TEXT,
    "valEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductAdvantages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductAdvantages_AB_unique" ON "_ProductAdvantages"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductAdvantages_B_index" ON "_ProductAdvantages"("B");

-- AddForeignKey
ALTER TABLE "ProductSpec" ADD CONSTRAINT "ProductSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpec" ADD CONSTRAINT "ProductSpec_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TechSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAdvantages" ADD CONSTRAINT "_ProductAdvantages_A_fkey" FOREIGN KEY ("A") REFERENCES "Advantage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAdvantages" ADD CONSTRAINT "_ProductAdvantages_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
