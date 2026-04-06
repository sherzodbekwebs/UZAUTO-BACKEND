/*
  Warnings:

  - You are about to drop the column `regionEn` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `regionRu` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `regionUz` on the `Dealer` table. All the data in the column will be lost.
  - Made the column `categoryRu` on table `Dealer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "regionEn",
DROP COLUMN "regionRu",
DROP COLUMN "regionUz",
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "categoryRu" SET NOT NULL;
