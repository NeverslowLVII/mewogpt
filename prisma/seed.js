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
            content: 'Salut',
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
            content: "Belle journée, n'est-ce pas ?",
            role: 'user',
            timestamp: new Date(),
          },
          {
            content: 'Oui, en effet !',
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
            content: 'Ceci est une conversation privée',
            role: 'user',
            timestamp: new Date(),
          },
          {
            content: 'Gardons cela secret',
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
