import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = await Promise.all(
    ['Asep', 'Budi', 'Citra', 'Dewi', 'Eko'].map((name, i) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase()}@mail.com`,
          password: hashedPassword,
          role: i === 0 ? 'ADMIN' : i === 1 ? 'PETANI' : 'USER',
        },
      })
    )
  );

  // Seed Legal Questions
  for (let user of users) {
    await prisma.legalQuestion.create({
      data: {
        userId: user.id,
        question: `Apakah ${user.name} boleh membuka usaha di tanah warisan?`,
        aiResponse: 'Anda dapat membuka usaha jika seluruh ahli waris menyetujui.',
        category: 'Tanah',
      },
    });
  }

  // Seed Legal Threads & Messages
  for (let user of users) {
    const thread = await prisma.legalThread.create({
      data: {
        userId: user.id,
        title: `Konsultasi hukum oleh ${user.name}`,
      },
    });

    await prisma.legalMessage.createMany({
      data: [
        {
          threadId: thread.id,
          sender: 'USER',
          message: 'Apa syarat sah perjanjian?',
        },
        {
          threadId: thread.id,
          sender: 'AI',
          message: 'Syarat sah perjanjian meliputi kesepakatan, kecakapan, dan objek yang halal.',
        },
      ],
    });
  }

  // Seed Farm Entries + Advice
  const petani = users.find((u) => u.role === 'PETANI');
  if (petani) {
    for (let i = 0; i < 5; i++) {
      const entry = await prisma.farmEntry.create({
        data: {
          userId: petani.id,
          plantType: ['Padi', 'Jagung', 'Cabai', 'Kangkung', 'Tomat'][i],
          location: `Desa ${i + 1}`,
          plantedAt: new Date(Date.now() - i * 86400000 * 7),
        },
      });

      await prisma.farmAdvice.create({
        data: {
          farmEntryId: entry.id,
          type: 'watering',
          adviceText: 'Lakukan penyiraman setiap pagi dan sore hari.',
        },
      });
    }
  }

  // Seed Projects
  const projectList = await Promise.all(
    [...Array(5)].map((_, i) =>
      prisma.project.create({
        data: {
          creatorId: users[0].id,
          title: `Proyek Pembangunan ${i + 1}`,
          description: 'Pembangunan infrastruktur desa.',
          imageUrl: null,
          targetAmount: 5000000,
          deadline: new Date(Date.now() + 86400000 * 30),
        },
      })
    )
  );

  // Seed Donations
  for (let i = 0; i < 5; i++) {
    await prisma.donation.create({
      data: {
        donorId: users[i % users.length].id,
        projectId: projectList[i].id,
        amount: 100000 + i * 50000,
        paymentMethod: 'QRIS',
        paymentStatus: 'PAID',
        paymentReference: `INV-${i + 100}`,
        proofUrl: null,
      },
    });
  }

  // Seed Notifications
  for (let user of users) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Info Hukum',
        message: 'Periksa kembali dokumen tanah anda.',
        type: 'HUKUM',
      },
    });
  }

  console.log('✅ Seed data inserted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
