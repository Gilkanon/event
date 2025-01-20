import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsEnv = process.env.ROUNDS || '10';
const rounds = parseInt(roundsEnv, 10);

const main = async () => {
  const alexPassword = await bcrypt.hash('alexPassword', rounds);
  const johnPassword = await bcrypt.hash('johnPassword', rounds);

  const alex = await prisma.user.upsert({
    where: { email: 'alex@alex.com' },
    update: { password: alexPassword },
    create: {
      name: 'Alex',
      email: 'alex@alex.com',
      password: alexPassword,
      role: 'ADMIN',
    },
  });

  const john = await prisma.user.upsert({
    where: { email: 'john@jhon.com' },
    update: { password: johnPassword },
    create: {
      name: 'John',
      email: 'john@john.com',
      password: johnPassword,
    },
  });

  console.log({ alex, john });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
