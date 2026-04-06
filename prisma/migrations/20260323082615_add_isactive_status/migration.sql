-- AlterTable
ALTER TABLE "Catalog" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Dealer" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Management" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
