import { z } from 'zod';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validated = schema.parse(data);
      req[source] = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return res.status(422).json({
          success: false,
          message: 'Validasi gagal',
          errors
        });
      }
      next(error);
    }
  };
};


export const schemas = {
  
  register: z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
    email: z.string().email('Format email tidak valid'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password minimal 6 karakter')
  }),
  
  login: z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi')
  }),

  
  createKegiatan: z.object({
    judul: z.string().min(5, 'Judul minimal 5 karakter').max(200),
    deskripsi: z.string().min(20, 'Deskripsi minimal 20 karakter'),
    foto_url: z.string().url('Format URL foto tidak valid').optional(),
    target_dana: z.number().min(100000, 'Target dana minimal Rp 100.000'),
    tanggal_mulai: z.string().datetime('Format tanggal tidak valid'),
    tanggal_selesai: z.string().datetime('Format tanggal tidak valid'),
    jadwal: z.array(z.string()).optional(),
    persyaratan: z.object({}).optional(),
    galeri: z.array(z.string().url()).optional(),
    qris_url: z.string().url('Format URL QRIS tidak valid').optional()
  }),

  updateKegiatan: z.object({
    judul: z.string().min(5).max(200).optional(),
    deskripsi: z.string().min(20).optional(),
    foto_url: z.string().url().optional(),
    target_dana: z.number().min(100000).optional(),
    tanggal_mulai: z.string().datetime().optional(),
    tanggal_selesai: z.string().datetime().optional(),
    jadwal: z.array(z.string()).optional(),
    persyaratan: z.object({}).optional(),
    galeri: z.array(z.string().url()).optional(),
    qris_url: z.string().url().optional(),
    status: z.enum(['AKTIF', 'SELESAI', 'DIBATALKAN']).optional()
  }),

  createDonasi: z.object({
    amount: z.number().min(10000, 'Minimal donasi Rp 10.000'),
    donorName: z.string().max(100).optional(),
    donorEmail: z.string().email().optional(),
    donorPhone: z.string().max(20).optional(),
    isAnonymous: z.boolean().default(false),
    message: z.string().max(500).optional(),
    bukti_transfer_url: z.string().url('URL bukti transfer tidak valid')
  }),

  verifyDonasi: z.object({
    action: z.enum(['approve', 'reject'], 'Action harus approve atau reject'),
    reason: z.string().max(500).optional()
  }),

  
  createThread: z.object({
    title: z.string().min(5, 'Judul minimal 5 karakter').max(200)
  }),

  sendMessage: z.object({
    message: z.string()
      .min(2, 'Pesan minimal 2 karakter')
      .max(500, 'Pesan maksimal 500 karakter')
  }),

  
  createFarmAnalysis: z.object({
    farmEntryId: z.string().min(1),
    harvestDate: z.string().datetime(),
    plant: z.string().min(2, 'Jenis tanaman minimal 2 karakter'),
    location: z.string().min(2, 'Lokasi minimal 2 karakter'),
    question: z.string().max(500).optional()
  })
};