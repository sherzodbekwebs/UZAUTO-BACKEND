/*
  Warnings:

  - You are about to drop the column `descEn` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `descRu` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `descUz` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "descEn",
DROP COLUMN "descRu",
DROP COLUMN "descUz";
