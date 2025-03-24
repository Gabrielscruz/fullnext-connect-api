import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();


export const prismaClients: Record<string, PrismaClient> = {};

function getPrismaClient(tenant: string): PrismaClient {
  const dbname = tenant || "fullnext";
  
  const DATABASE_URL = process.env.DATABASE_URL?.replace("<dbname>", dbname);

  if (!DATABASE_URL) {
    throw new Error("A DATABASE_URL não está configurada corretamente no .env");
  }

  if (!prismaClients[dbname]) {
    prismaClients[dbname] = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }

  return prismaClients[dbname];
}

export { getPrismaClient };
