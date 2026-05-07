import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ดู audit log ล่าสุด 10 รายการ
  const logs = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      versionId: true,
      action: true,
      details: true,
      createdAt: true
    }
  });

  console.log('📋 Audit Log ล่าสุด 10 รายการ:');
  logs.forEach((log, i) => {
    const time = log.createdAt.toISOString().substring(11, 19); // HH:mm:ss
    console.log(`${i+1}. [${time}] Version ${log.versionId} - ${log.action} - ${log.details}`);
  });

  // นับ CALCULATE ล่าสุด
  const recentCalculates = await prisma.auditLog.findMany({
    where: {
      action: 'CALCULATE'
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      versionId: true,
      createdAt: true
    }
  });

  console.log('\n📊 CALCULATE logs ล่าสุด 10 รายการ:');
  recentCalculates.forEach((log, i) => {
    const time = log.createdAt.toISOString().substring(11, 23); // HH:mm:ss.SSS
    console.log(`${i+1}. Version ${log.versionId} - ${time}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
