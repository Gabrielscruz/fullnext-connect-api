import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    prisma: PrismaClient;
  }
}
