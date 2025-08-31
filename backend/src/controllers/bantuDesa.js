import prisma from "../../prisma/index.js";
import { v4 as uuidv4 } from "uuid";


export const getKegiatanAktif = async (req, res) => {
  try {
    const { status = "aktif" } = req.query;
    
    const kegiatan = await prisma.kegiatanDesa.findMany({
      where: { 
        status: status.toUpperCase()
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        donations: {
          where: { status: "APPROVED" },
          select: {
            amount: true
          }
        },
        _count: {
          select: {
            donations: {
              where: { status: "APPROVED" }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    
    const kegiatanWithProgress = kegiatan.map(item => ({
      ...item,
      dana_terkumpul: item.donations.reduce((sum, donation) => sum + donation.amount, 0),
      jumlah_donatur: item._count.donations
    }));

    res.json(kegiatanWithProgress);
  } catch (error) {
    console.error("❌ Get Kegiatan Error:", error);
    res.status(500).json({ message: "Gagal mengambil data kegiatan." });
  }
};


export const getDetailKegiatan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const kegiatan = await prisma.kegiatanDesa.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        donations: {
          where: { status: "APPROVED" },
          include: {
            donor: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        _count: {
          select: {
            donations: {
              where: { status: "APPROVED" }
            }
          }
        }
      }
    });

    if (!kegiatan) {
      return res.status(404).json({ message: "Kegiatan tidak ditemukan." });
    }

    
    const danaTerkumpul = kegiatan.donations.reduce((sum, donation) => sum + donation.amount, 0);

    const result = {
      ...kegiatan,
      dana_terkumpul: danaTerkumpul,
      jumlah_donatur: kegiatan._count.donations,
      daftar_donatur: kegiatan.donations.map(donation => ({
        nama: donation.isAnonymous ? "Hamba Allah" : donation.donor?.name || donation.donorName,
        jumlah: donation.amount,
        tanggal: donation.createdAt
      }))
    };

    res.json(result);
  } catch (error) {
    console.error("❌ Get Detail Kegiatan Error:", error);
    res.status(500).json({ message: "Gagal mengambil detail kegiatan." });
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
      return res.status(403).json({ message: "Hanya admin yang dapat membuat kegiatan." });
    }

    
    if (!judul || !deskripsi || !target_dana || !tanggal_mulai || !tanggal_selesai) {
      return res.status(400).json({ 
        message: "Judul, deskripsi, target dana, tanggal mulai, dan tanggal selesai wajib diisi." 
      });
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
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: "Kegiatan berhasil dibuat.",
      kegiatan
    });
  } catch (error) {
    console.error("❌ Create Kegiatan Error:", error);
    res.status(500).json({ message: "Gagal membuat kegiatan." });
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
      return res.status(400).json({ 
        message: "Jumlah donasi dan bukti transfer wajib diisi." 
      });
    }

    if (amount < 10000) {
      return res.status(400).json({ 
        message: "Minimal donasi adalah Rp 10.000." 
      });
    }

    
    const kegiatan = await prisma.kegiatanDesa.findUnique({
      where: { id: kegiatanId }
    });

    if (!kegiatan) {
      return res.status(404).json({ message: "Kegiatan tidak ditemukan." });
    }

    if (kegiatan.status !== "AKTIF") {
      return res.status(400).json({ message: "Kegiatan tidak aktif." });
    }

    if (new Date() > kegiatan.tanggal_selesai) {
      return res.status(400).json({ message: "Kegiatan sudah berakhir." });
    }

    
    const donasi = await prisma.donasiDesa.create({
      data: {
        kegiatanId,
        donorId: req.user?.id || null,
        donorName: isAnonymous ? "" : (donorName || req.user?.name || ""),
        donorEmail: donorEmail || req.user?.email || "",
        donorPhone: donorPhone || req.user?.phone || "",
        amount: parseInt(amount),
        isAnonymous,
        message,
        bukti_transfer_url,
        status: "PENDING",
        reference: `DON-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`
      }
    });

    
    await prisma.notification.create({
      data: {
        userId: kegiatan.creatorId,
        title: "Donasi Baru Masuk",
        message: `Ada donasi baru sebesar Rp ${amount.toLocaleString("id-ID")} untuk kegiatan "${kegiatan.judul}". Silakan periksa dan verifikasi.`,
        type: "DONATION"
      }
    });

    res.status(201).json({
      message: "Donasi berhasil dikirim. Menunggu verifikasi admin.",
      donasi: {
        ...donasi,
        kegiatan_judul: kegiatan.judul
      }
    });
  } catch (error) {
    console.error("❌ Create Donasi Error:", error);
    res.status(500).json({ message: "Gagal mengirim donasi." });
  }
};


export const getDonasiPending = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang dapat melihat donasi pending." });
    }

    const donasi = await prisma.donasiDesa.findMany({
      where: { status: "PENDING" },
      include: {
        kegiatan: {
          select: {
            judul: true,
            foto_url: true
          }
        },
        donor: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(donasi);
  } catch (error) {
    console.error("❌ Get Donasi Pending Error:", error);
    res.status(500).json({ message: "Gagal mengambil data donasi pending." });
  }
};


export const verifyDonasi = async (req, res) => {
  try {
    const { id: donasiId } = req.params;
    const { action, reason = "" } = req.body; 

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang dapat verifikasi donasi." });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Action harus 'approve' atau 'reject'." });
    }

    const donasi = await prisma.donasiDesa.findUnique({
      where: { id: donasiId },
      include: {
        kegiatan: true,
        donor: true
      }
    });

    if (!donasi) {
      return res.status(404).json({ message: "Donasi tidak ditemukan." });
    }

    if (donasi.status !== "PENDING") {
      return res.status(400).json({ message: "Donasi sudah diverifikasi sebelumnya." });
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
        where: {
          kegiatanId: donasi.kegiatanId,
          status: "APPROVED"
        },
        _sum: {
          amount: true
        }
      });

      
      if (totalDonasi._sum.amount >= donasi.kegiatan.target_dana) {
        await prisma.kegiatanDesa.update({
          where: { id: donasi.kegiatanId },
          data: { status: "SELESAI" }
        });
      }
    }

    
    if (donasi.donorId) {
      const notifMessage = action === "approve" 
        ? `Terima kasih! Donasi Anda sebesar Rp ${donasi.amount.toLocaleString("id-ID")} untuk "${donasi.kegiatan.judul}" telah diverifikasi.`
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

    res.json({
      message: `Donasi berhasil ${action === "approve" ? "disetujui" : "ditolak"}.`,
      donasi: updatedDonasi
    });
  } catch (error) {
    console.error("❌ Verify Donasi Error:", error);
    res.status(500).json({ message: "Gagal verifikasi donasi." });
  }
};


export const getDonasiHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User belum login." });
    }

    const donasi = await prisma.donasiDesa.findMany({
      where: { donorId: req.user.id },
      include: {
        kegiatan: {
          select: {
            judul: true,
            foto_url: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(donasi);
  } catch (error) {
    console.error("❌ Get Donasi History Error:", error);
    res.status(500).json({ message: "Gagal mengambil riwayat donasi." });
  }
};


export const updateKegiatan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang dapat mengupdate kegiatan." });
    }

    
    if (updateData.jadwal) updateData.jadwal = JSON.stringify(updateData.jadwal);
    if (updateData.persyaratan) updateData.persyaratan = JSON.stringify(updateData.persyaratan);
    if (updateData.galeri) updateData.galeri = JSON.stringify(updateData.galeri);
    
    
    if (updateData.tanggal_mulai) updateData.tanggal_mulai = new Date(updateData.tanggal_mulai);
    if (updateData.tanggal_selesai) updateData.tanggal_selesai = new Date(updateData.tanggal_selesai);
    if (updateData.target_dana) updateData.target_dana = parseInt(updateData.target_dana);

    const kegiatan = await prisma.kegiatanDesa.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: "Kegiatan berhasil diupdate.",
      kegiatan
    });
  } catch (error) {
    console.error("❌ Update Kegiatan Error:", error);
    res.status(500).json({ message: "Gagal mengupdate kegiatan." });
  }
};


export const deleteKegiatan = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang dapat menghapus kegiatan." });
    }

    
    const approvedDonations = await prisma.donasiDesa.count({
      where: {
        kegiatanId: id,
        status: "APPROVED"
      }
    });

    if (approvedDonations > 0) {
      return res.status(400).json({ 
        message: "Tidak dapat menghapus kegiatan yang sudah memiliki donasi yang disetujui." 
      });
    }

    
    await prisma.donasiDesa.deleteMany({
      where: { kegiatanId: id }
    });

    
    await prisma.kegiatanDesa.delete({
      where: { id }
    });

    res.json({ message: "Kegiatan berhasil dihapus." });
  } catch (error) {
    console.error("❌ Delete Kegiatan Error:", error);
    res.status(500).json({ message: "Gagal menghapus kegiatan." });
  }
};