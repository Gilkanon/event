import { PrismaClient, EventStatus, EventCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.deleteMany({});
  await prisma.event.deleteMany({});

  const event1 = await prisma.event.create({
    data: {
      title: 'Concert in the Park',
      description: 'An amazing outdoor concert with popular bands.',
      category: EventCategory.ENTERTAINMENT,
      status: EventStatus.ACTIVE,
      date: new Date('2023-10-10T18:00:00Z'),
      location: 'Central Park, NYC',
      createdBy: 1,
      imageUrl: 'https://example.com/images/concert.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=example1',
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Tech Conference 2023',
      description: 'A conference about the latest trends in technology.',
      category: EventCategory.EDUCATION,
      status: EventStatus.ACTIVE,
      date: new Date('2023-11-15T09:00:00Z'),
      location: 'Convention Center, SF',
      createdBy: 2,
      imageUrl: 'https://example.com/images/tech_conf.jpg',
      videoUrl: '',
    },
  });

  const subscription1 = await prisma.subscription.create({
    data: {
      userId: 1,
      eventId: event1.id,
    },
  });

  console.log('Seeding completed.', { event1, event2, subscription1 });
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
