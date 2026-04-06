-- CreateTable
CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "subject" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);
