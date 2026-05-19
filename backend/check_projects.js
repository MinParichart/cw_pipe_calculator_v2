// Check projects in database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProjects() {
  try {
    // Check all projects
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        versions: {
          select: {
            id: true,
            name: true,
            versionNumber: true,
            isCurrent: true
          }
        },
        criteria: true
      }
    });

    console.log('\n=== PROJECTS IN DATABASE ===');
    console.log(`Total projects: ${projects.length}`);

    if (projects.length === 0) {
      console.log('❌ NO PROJECTS FOUND!');
      console.log('\nCreating a test project...');

      // Check if there's a user
      const users = await prisma.user.findMany();
      if (users.length === 0) {
        console.log('❌ NO USERS FOUND! Creating a test user...');

        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');

        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
          data: {
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
            role: 'USER'
          }
        });

        console.log(`✅ Created test user: ${user.email} (password: password123)`);
      }

      // Create a test project
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        const project = await prisma.project.create({
          data: {
            name: 'ทดสอบโปรเจกต์',
            description: 'โปรเจกต์ทดสอบระบบ',
            ownerId: firstUser.id,
            type: 'ทาวน์โฮม',
            status: 'แบบร่าง'
          }
        });

        console.log(`✅ Created test project: ${project.name}`);
      }
    } else {
      projects.forEach((project, index) => {
        console.log(`\n${index + 1}. ${project.name}`);
        console.log(`   ID: ${project.id}`);
        console.log(`   Owner: ${project.owner?.name || 'Unknown'} (${project.owner?.email || 'N/A'})`);
        console.log(`   Type: ${project.type || 'N/A'}`);
        console.log(`   Status: ${project.status || 'N/A'}`);
        console.log(`   Versions: ${project.versions?.length || 0}`);
        console.log(`   Has Criteria: ${project.criteria ? '✅' : '❌'}`);

        if (project.versions && project.versions.length > 0) {
          console.log('   Version List:');
          project.versions.forEach((v) => {
            const current = v.isCurrent ? ' ⭐ CURRENT' : '';
            console.log(`     - V${v.versionNumber}: ${v.name}${current}`);
          });
        }
      });

      console.log('\n=== DATABASE SUMMARY ===');
      console.log(`✅ Found ${projects.length} projects`);
      console.log(`✅ Projects are still in the database`);
    }

  } catch (error) {
    console.error('Error checking projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjects();
