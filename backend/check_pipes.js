const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const v = await prisma.version.findFirst({
    where: { projectId: 6 },
    orderBy: { versionNumber: 'desc' }
  });

  const network = JSON.parse(v.snapshotNetwork);

  console.log('=== Pipe Lengths in snapshotNetwork ===');
  network.pipes.forEach((p, i) => {
    console.log(`Pipe ${i+1} (ID ${p.id}): length=${p.length}, isCriticalPath=${p.isCriticalPath}`);
  });

  console.log('\n=== Calculating Major Loss ===');
  network.pipes.forEach((p, i) => {
    const length = p.length || 1;
    console.log(`Pipe ${i+1}: length=${length}m`);
  });

  await prisma.$disconnect();
})();
