import prisma from "../../prisma/index.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { v4 as uuidv4 } from "uuid";

export const getKegiatanAktif = async (req, res) => {
  try {
    const { status = "AKTIF", page = 1, limit = 10, search = "" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {
      status: status.toUpperCase(),
      ...(search && {
        OR: [
          { judul: { contains: search, mode: "insensitive" } },
          { deskripsi: { contains: search, mode: "insensitive" } }
        ]
      })
    };

    const [kegiatan, total] = await Promise.all([
      prisma.kegiatanDesa.findMany({
        where: whereClause,
        include: {
          creator: { select: { id: true, name: true, email: true } },
          donations: {
            where: { status: "APPROVED" },
            select: { amount: true }
          },
          _count: {
            select: { donations: { where: { status: "APPROVED" } } }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit)
      }),
      prisma.kegiatanDesa.count({ where: whereClause })
    ]);

    const kegiatanWithProgress = kegiatan.map(item => ({
      ...item,
      dana_terkumpul: item.donations.reduce((sum, d) => sum + d.amount, 0),
      jumlah_donatur: item._count.donations,
      progress_percentage:
        item.target_dana > 0
          ? Math.round(
              (item.donations.reduce((sum, d) => sum + d.amount, 0) /
                item.target_dana) *
                100
            )
          : 0
    }));

    return successResponse(res, "Data kegiatan berhasil diambil", {
      data: kegiatanWithProgress,
      total
    });
  } catch (error) {
    console.error("❌ Get Kegiatan Error:", error);
    return errorResponse(res, "Gagal mengambil data kegiatan", error.message);
  }
};

export const getDetailKegiatan = async (req, res) => {
  try {
    const { id } = req.params;

    const kegiatan = await prisma.kegiatanDesa.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, phone: true } },
        donations: {
          where: { status: "APPROVED" },
          include: { donor: { select: { name: true } } },
          orderBy: { createdAt: "desc" }
        },
        _count: { select: { donations: { where: { status: "APPROVED" } } } }
      }
    });

    if (!kegiatan) {
      return errorResponse(res, "Kegiatan tidak ditemukan", null, 404);
    }

    const danaTerkumpul = kegiatan.donations.reduce(
      (sum, d) => sum + d.amount,
      0
    );

    const result = {
      ...kegiatan,
      dana_terkumpul: danaTerkumpul,
      jumlah_donatur: kegiatan._count.donations,
      daftar_donatur: kegiatan.donations.map(d => ({
        nama: d.isAnonymous ? "Hamba Allah" : d.donor?.name || d.donorName,
        jumlah: d.amount,
        tanggal: d.createdAt
      }))
    };

    return successResponse(res, "Detail kegiatan berhasil diambil", result);
  } catch (error) {
    console.error("❌ Get Detail Kegiatan Error:", error);
    return errorResponse(res, "Gagal mengambil detail kegiatan", error.message);
  }
};

export const createKegiatan = async (req, res) => {
  try {
    const {
      judul,
      deskripsi,
      foto_url,
      target_dana,
      tanggal_mulai,
      tanggal_selesai,
      jadwal = [],
      persyaratan = {},
      galeri = [],
      qris_url = ""
    } = req.body;

    if (req.user.role !== "ADMIN") {
      return errorResponse(
        res,
        "Hanya admin yang dapat membuat kegiatan.",
        null,
        403
      );
    }

    if (!judul || !deskripsi || !target_dana || !tanggal_mulai || !tanggal_selesai) {
      return errorResponse(
        res,
        "Judul, deskripsi, target dana, tanggal mulai, dan tanggal selesai wajib diisi.",
        null,
        400
      );
    }

    const kegiatan = await prisma.kegiatanDesa.create({
      data: {
        judul,
        deskripsi,
        foto_url,
        target_dana: parseInt(target_dana),
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
        jadwal: JSON.stringify(jadwal),
        persyaratan: JSON.stringify(persyaratan),
        galeri: JSON.stringify(galeri),
        qris_url,
        creatorId: req.user.id,
        status: "AKTIF"
      },
      include: { creator: { select: { name: true, email: true } } }
    });

    return successResponse(res, "Kegiatan berhasil dibuat", kegiatan, 201);
  } catch (error) {
    console.error("❌ Create Kegiatan Error:", error);
    return errorResponse(res, "Gagal membuat kegiatan", error.message);
  }
};

export const createDonasi = async (req, res) => {
  try {
    const { id: kegiatanId } = req.params;
    const {
      amount,
      donorName = "",
      donorEmail = "",
      donorPhone = "",
      isAnonymous = false,
      message = "",
      bukti_transfer_url
    } = req.body;

    if (!amount || !bukti_transfer_url) {
      return errorResponse(
        res,
        "Jumlah donasi dan bukti transfer wajib diisi.",
        null,
        400
      );
    }

    if (amount < 10000) {
      return errorResponse(res, "Minimal donasi adalah Rp 10.000.", null, 400);
    }

    const kegiatan = await prisma.kegiatanDesa.findUnique({
      where: { id: kegiatanId }
    });

    if (!kegiatan) {
      return errorResponse(res, "Kegiatan tidak ditemukan.", null, 404);
    }

    if (kegiatan.status !== "AKTIF") {
      return errorResponse(res, "Kegiatan tidak aktif.", null, 400);
    }

    if (new Date() > kegiatan.tanggal_selesai) {
      return errorResponse(res, "Kegiatan sudah berakhir.", null, 400);
    }

    const donasi = await prisma.donasiDesa.create({
      data: {
        kegiatanId,
        donorId: req.user?.id || null,
        donorName: isAnonymous ? "" : donorName || req.user?.name || "",
        donorEmail: donorEmail || req.user?.email || "",
        donorPhone: donorPhone || req.user?.phone || "",
        amount: parseInt(amount),
        isAnonymous,
        message,
        bukti_transfer_url,
        status: "PENDING",
        reference: `DON-${Date.now()}-${uuidv4()
          .substring(0, 8)
          .toUpperCase()}`
      }
    });

    await prisma.notification.create({
      data: {
        userId: kegiatan.creatorId,
        title: "Donasi Baru Masuk",
        message: `Ada donasi baru sebesar Rp ${amount.toLocaleString(
          "id-ID"
        )} untuk kegiatan "${kegiatan.judul}". Silakan periksa dan verifikasi.`,
        type: "DONATION"
      }
    });

    return successResponse(
      res,
      "Donasi berhasil dikirim. Menunggu verifikasi admin.",
      { ...donasi, kegiatan_judul: kegiatan.judul },
      201
    );
  } catch (error) {
    console.error("❌ Create Donasi Error:", error);
    return errorResponse(res, "Gagal mengirim donasi.", error.message);
  }
};

export const getDonasiPending = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return errorResponse(
        res,
        "Hanya admin yang dapat melihat donasi pending.",
        null,
        403
      );
    }

    const donasi = await prisma.donasiDesa.findMany({
      where: { status: "PENDING" },
      include: {
        kegiatan: { select: { judul: true, foto_url: true } },
        donor: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return successResponse(res, "Data donasi pending berhasil diambil", donasi);
  } catch (error) {
    console.error("❌ Get Donasi Pending Error:", error);
    return errorResponse(res, "Gagal mengambil data donasi pending.", error.message);
  }
};

export const verifyDonasi = async (req, res) => {
  try {
    const { id: donasiId } = req.params;
    const { action, reason = "" } = req.body;

    if (req.user.role !== "ADMIN") {
      return errorResponse(
        res,
        "Hanya admin yang dapat verifikasi donasi.",
        null,
        403
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return errorResponse(
        res,
        "Action harus 'approve' atau 'reject'.",
        null,
        400
      );
    }

    const donasi = await prisma.donasiDesa.findUnique({
      where: { id: donasiId },
      include: { kegiatan: true, donor: true }
    });

    if (!donasi) {
      return errorResponse(res, "Donasi tidak ditemukan.", null, 404);
    }

    if (donasi.status !== "PENDING") {
      return errorResponse(
        res,
        "Donasi sudah diverifikasi sebelumnya.",
        null,
        400
      );
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

    const updatedDonasi = await prisma.donasiDesa.update({
      where: { id: donasiId },
      data: {
        status: newStatus,
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
        adminNote: reason
      }
    });

    if (action === "approve") {
      const totalDonasi = await prisma.donasiDesa.aggregate({
        where: { kegiatanId: donasi.kegiatanId, status: "APPROVED" },
        _sum: { amount: true }
      });

      if (totalDonasi._sum.amount >= donasi.kegiatan.target_dana) {
        await prisma.kegiatanDesa.update({
          where: { id: donasi.kegiatanId },
          data: { status: "SELESAI" }
        });
      }
    }

    if (donasi.donorId) {
      const notifMessage =
        action === "approve"
          ? `Terima kasih! Donasi Anda sebesar Rp ${donasi.amount.toLocaleString(
              "id-ID"
            )} untuk "${donasi.kegiatan.judul}" telah diverifikasi.`
          : `Maaf, donasi Anda untuk "${donasi.kegiatan.judul}" tidak dapat diverifikasi. ${reason}`;

      await prisma.notification.create({
        data: {
          userId: donasi.donorId,
          title: action === "approve" ? "Donasi Diverifikasi" : "Donasi Ditolak",
          message: notifMessage,
          type: "DONATION"
        }
      });
    }

    return successResponse(
      res,
      `Donasi berhasil ${
        action === "approve" ? "disetujui" : "ditolak"
      }.`,
      updatedDonasi
    );
  } catch (error) {
    console.error("❌ Verify Donasi Error:", error);
    return errorResponse(res, "Gagal verifikasi donasi.", error.message);
  }
};

export const getDonasiHistory = async (req, res) => {
  try {
    if (!req.user) {
      return errorResponse(res, "User belum login.", null, 401);
    }

    const donasi = await prisma.donasiDesa.findMany({
      where: { donorId: req.user.id },
      include: { kegiatan: { select: { judul: true, foto_url: true } } },
      orderBy: { createdAt: "desc" }
    });

    return successResponse(res, "Riwayat donasi berhasil diambil", donasi);
  } catch (error) {
    console.error("❌ Get Donasi History Error:", error);
    return errorResponse(res, "Gagal mengambil riwayat donasi.", error.message);
  }
};

export const updateKegiatan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.user.role !== "ADMIN") {
      return errorResponse(
        res,
        "Hanya admin yang dapat mengupdate kegiatan.",
        null,
        403
      );
    }

    if (updateData.jadwal) updateData.jadwal = JSON.stringify(updateData.jadwal);
    if (updateData.persyaratan)
      updateData.persyaratan = JSON.stringify(updateData.persyaratan);
    if (updateData.galeri) updateData.galeri = JSON.stringify(updateData.galeri);

    if (updateData.tanggal_mulai)
      updateData.tanggal_mulai = new Date(updateData.tanggal_mulai);
    if (updateData.tanggal_selesai)
      updateData.tanggal_selesai = new Date(updateData.tanggal_selesai);
    if (updateData.target_dana)
      updateData.target_dana = parseInt(updateData.target_dana);

    const kegiatan = await prisma.kegiatanDesa.update({
      where: { id },
      data: updateData
    });

    return successResponse(res, "Kegiatan berhasil diupdate.", kegiatan);
  } catch (error) {
    console.error("❌ Update Kegiatan Error:", error);
    return errorResponse(res, "Gagal mengupdate kegiatan.", error.message);
  }
};

export const deleteKegiatan = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return errorResponse(
        res,
        "Hanya admin yang dapat menghapus kegiatan.",
        null,
        403
      );
    }

    const approvedDonations = await prisma.donasiDesa.count({
      where: { kegiatanId: id, status: "APPROVED" }
    });

    if (approvedDonations > 0) {
      return errorResponse(
        res,
        "Tidak dapat menghapus kegiatan yang sudah memiliki donasi yang disetujui.",
        null,
        400
      );
    }

    await prisma.donasiDesa.deleteMany({ where: { kegiatanId: id } });
    await prisma.kegiatanDesa.delete({ where: { id } });

    return successResponse(res, "Kegiatan berhasil dihapus.", null);
  } catch (error) {
    console.error("❌ Delete Kegiatan Error:", error);
    return errorResponse(res, "Gagal menghapus kegiatan.", error.message);
  }
};
    