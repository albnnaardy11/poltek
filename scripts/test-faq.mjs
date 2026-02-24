import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Testing prisma.faq access...');
    const count = await prisma.faq.count();
    console.log('Count:', count);
  } catch (err) {
    console.error('Error accessing prisma.faq:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
