import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    },
  },
})

async function check() {
  try {
    // @ts-ignore
    const count = await prisma.navigation.count();
    console.log('Total Navigation Items:', count);
    // @ts-ignore
    const roots = await prisma.navigation.findMany({ where: { parentId: null } });
    console.log('Root Items:', roots.map(r => r.title));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
