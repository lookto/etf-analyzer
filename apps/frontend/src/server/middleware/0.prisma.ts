import { PrismaClient } from '@etf-analyzer/db';

let prisma: PrismaClient;

declare module 'h3' {
  interface H3EventContext {
    prisma: PrismaClient;
  }
}

export default eventHandler((event) => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  // eslint-disable-next-line no-param-reassign
  event.context.prisma = prisma;
});
