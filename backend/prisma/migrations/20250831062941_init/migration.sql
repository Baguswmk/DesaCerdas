-- CreateEnum
CREATE TYPE "KegiatanStatus" AS ENUM ('AKTIF', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "DonasiStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "KegiatanDesa" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "foto_url" TEXT,
    "target_dana" INTEGER NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "jadwal" TEXT,
    "persyaratan" TEXT,
    "galeri" TEXT,
    "qris_url" TEXT,
    "status" "KegiatanStatus" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KegiatanDesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonasiDesa" (
    "id" TEXT NOT NULL,
    "kegiatanId" TEXT NOT NULL,
    "donorId" TEXT,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "amount" INTEGER NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "bukti_transfer_url" TEXT NOT NULL,
    "status" "DonasiStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonasiDesa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonasiDesa_reference_key" ON "DonasiDesa"("reference");

-- AddForeignKey
ALTER TABLE "KegiatanDesa" ADD CONSTRAINT "KegiatanDesa_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonasiDesa" ADD CONSTRAINT "DonasiDesa_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "KegiatanDesa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonasiDesa" ADD CONSTRAINT "DonasiDesa_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonasiDesa" ADD CONSTRAINT "DonasiDesa_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
