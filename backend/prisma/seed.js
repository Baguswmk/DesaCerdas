import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Kosongkan semua tabel (urutan penting)
  await prisma.donation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.legalMessage.deleteMany();
  await prisma.legalThread.deleteMany();
  await prisma.legalQuestion.deleteMany();
  await prisma.farmAdvice.deleteMany();
  await prisma.farmEntry.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIUsage.deleteMany();
  await prisma.user.deleteMany();

  // Buat user
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

  // LegalQuestion
  await prisma.legalQuestion.create({
    data: {
      userId: user.id,
      question: 'Bolehkah membangun di tanah warisan?',
      aiResponse: 'Boleh jika disetujui semua ahli waris.',
      category: 'Tanah',
    },
  });

  // LegalThread + Messages
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

  // FarmEntry + Advice (Petani)
  const farm = await prisma.farmEntry.create({
    data: {
      userId: petani.id,
      plantType: 'Padi',
      location: 'Desa Cerdas',
      plantedAt: new Date(),
    },
  });

  await prisma.farmAdvice.create({
    data: {
      farmEntryId: farm.id,
      type: 'watering',
      adviceText: 'Siram dua kali sehari.',
    },
  });

  // Project + Donation
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

  // Notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Hukum Tanah',
      message: 'Cek legalitas sertifikat Anda.',
      type: 'HUKUM',
    },
  });

  // AI Usage
  await prisma.aIUsage.create({
    data: {
      userId: user.id,
      date: new Date(),
      count: 2,
    },
  });

  console.log('✅ Seed minimal berhasil!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
