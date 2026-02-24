import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    },
  },
})

async function check() {
  try {
    const result = await prisma.$queryRawUnsafe('SELECT count(*) FROM faqs');
    console.log('DATABASE_CHECK_SUCCESS');
    // Convert BigInt to string for logging
    const serialized = JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    console.log('Data in faqs table:', serialized);
  } catch (err) {
    console.log('DATABASE_CHECK_ERROR');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
