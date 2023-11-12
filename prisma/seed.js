const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: 'password',
    },
  });
  const conversationPublic1 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            content: 'Hello world',
            role: 'user',
            timestamp: new Date(),
          },
          {
            content: 'Hi',
            role: 'assistant',
            timestamp: new Date(new Date().getTime() + 5000),
          },
        ],
      },
    },
  });
  const conversationPublic2 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            content: "Nice day, isn't it?",
            role: 'user',
            timestamp: new Date(),
          },
          {
            content: 'Yes, it is!',
            role: 'assistant',
            timestamp: new Date(new Date().getTime() + 2000),
          },
        ],
      },
    },
  });

  const conversationPrivate1 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            content: 'This is a private conversation',
            role: 'user',
            timestamp: new Date(),
          },
          {
            content: "Let's keep it secret",
            role: 'assistant',
            timestamp: new Date(new Date().getTime() + 5000),
          },
        ],
      },
      user: {
        connect: {
          id: user1.id,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
