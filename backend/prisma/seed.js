import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  
  await prisma.donation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.legalMessage.deleteMany();
  await prisma.legalThread.deleteMany();
  await prisma.legalQuestion.deleteMany();
  await prisma.farmAdvice.deleteMany();
  await prisma.farmAnalysis.deleteMany();
  await prisma.farmEntry.deleteMany();
  await prisma.weatherForecast.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIUsage.deleteMany();
  await prisma.user.deleteMany();

  
  const hashed = await bcrypt.hash('password123', 10);
  const [admin, petani, user] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@mail.com',
        password: hashed,
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Petani',
        email: 'petani@mail.com',
        password: hashed,
        role: 'PETANI',
      },
    }),
    prisma.user.create({
      data: {
        name: 'User',
        email: 'user@mail.com',
        password: hashed,
        role: 'USER',
      },
    }),
  ]);

  
  await prisma.legalQuestion.create({
    data: {
      userId: user.id,
      question: 'Bolehkah membangun di tanah warisan?',
      aiResponse: 'Boleh jika disetujui semua ahli waris.',
      category: 'Tanah',
    },
  });

  
  const thread = await prisma.legalThread.create({
    data: {
      userId: user.id,
      title: 'Pertanyaan Hukum Pertama',
    },
  });

  await prisma.legalMessage.createMany({
    data: [
      {
        threadId: thread.id,
        sender: 'USER',
        message: 'Apa itu warisan sah?',
      },
      {
        threadId: thread.id,
        sender: 'AI',
        message: 'Warisan sah adalah harta yang ditinggalkan pewaris dengan dasar hukum.',
      },
    ],
  });

  
  const farm = await prisma.farmEntry.create({
    data: {
      userId: petani.id,
      plantType: 'Padi',
      location: 'Desa Cerdas',
      plantedAt: new Date('2025-07-01'),
      expectedHarvestDate: new Date('2025-10-10'),
    },
  });

  await prisma.farmAdvice.create({
    data: {
      farmEntryId: farm.id,
      type: 'watering',
      adviceText: 'Siram dua kali sehari.',
    },
  });

  
  await prisma.farmAnalysis.create({
    data: {
      farmEntryId: farm.id,
      harvestDate: new Date('2025-10-10'),
      steps: [
        'Persiapkan lahan dengan membersihkan gulma.',
        'Olah tanah hingga 30 cm, buat bedengan.',
        'Tanam benih dengan jarak 25x25 cm.',
        'Pupuk dasar 10kg/10m2.',
        'Penyiraman rutin pagi & sore.'
      ],
      risks: [
        'Serangan wereng pada musim hujan.',
        'Penyakit blast menyerang batang.',
        'Kekeringan saat curah hujan rendah.',
        'Banjir merusak perakaran.'
      ],
    },
  });

  
  const baseDate = new Date('2025-07-03');
  for (let i = 0; i < 4; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    await prisma.weatherForecast.create({
      data: {
        location: 'Desa Cerdas',
        date,
        forecast: i % 2 === 0 ? 'Cerah Berawan' : 'Hujan Ringan',
        temperature: 27 + i,
        humidity: 75 - i * 2,
        windSpeed: 12 - i,
      },
    });
  }

  
  const project = await prisma.project.create({
    data: {
      creatorId: admin.id,
      title: 'Pembangunan Jembatan',
      description: 'Untuk menghubungkan dusun A dan B',
      targetAmount: 10000000,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  await prisma.donation.create({
    data: {
      donorId: user.id,
      projectId: project.id,
      amount: 200000,
      paymentMethod: 'QRIS',
      paymentStatus: 'PAID',
      paymentReference: 'INV-001',
    },
  });

  
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Hukum Tanah',
      message: 'Cek legalitas sertifikat Anda.',
      type: 'HUKUM',
    },
  });

  
  await prisma.aIUsage.create({
    data: {
      userId: user.id,
      date: new Date(),
      count: 2,
    },
  });

  console.log('✅ Seed data lengkap berhasil!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
