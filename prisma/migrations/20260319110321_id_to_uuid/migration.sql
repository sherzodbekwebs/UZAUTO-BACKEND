/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ComplianceReport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `News` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Vacancy` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admin_id_seq";

-- AlterTable
ALTER TABLE "ComplianceReport" DROP CONSTRAINT "ComplianceReport_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ComplianceReport_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ComplianceReport_id_seq";

-- AlterTable
ALTER TABLE "News" DROP CONSTRAINT "News_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "News_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "News_id_seq";

-- AlterTable
ALTER TABLE "Vacancy" DROP CONSTRAINT "Vacancy_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Vacancy_id_seq";
