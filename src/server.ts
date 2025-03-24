import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from '@fastify/multipart';
import { resolve } from 'path';

import { authenticationRoutes } from "./routes/authenticationRoutes";
import { usersRoutes } from "./routes/usersRoutes";
import { menuLinkRoutes } from "./routes/menuLinkRoutes";
import { accessControlRoutes } from "./routes/accessControlRoutes";
import { moduleRoutes } from "./routes/moduleRoutes";
import { reportUsageRoutes } from "./routes/reportUsageRoutes";
import { reportEmbedRoutes } from "./routes/reportEmbedRoutes";
import { powerBiCredentialRoutes } from "./routes/powerBiCredentialRoutes";
import { filterRoutes } from "./routes/filterRoutes";
import { getPrismaClient, prismaClients } from "./lib/prisma";
import { config } from "dotenv";
import { feedbackRoutes } from "./routes/feedbackRoutes";
import { translateRoutes } from "./routes/translateRoutes";
import { organizationRoutes } from "./routes/organizationRoutes";
import { paymentRoutes } from "./routes/paymentRoutes";

config();

export const app = fastify();

app.register(multipart)
app.register(require('@fastify/static'), {
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads',
})

app.register(cors, {
  origin: [
    'https://fullnext-connect.vercel.app', 
    'http://localhost:3000',
    /^http:\/\/[\w-]+\.localhost:\d+$/, // Permite qualquer subdomínio de localhost
  ],
  methods: ['GET', 'POST', 'PUT', 'PATH', 'DELETE', 'OPTIONS'],
  credentials: true // Caso esteja usando cookies ou autenticação via headers
});


app.register(jwt, {
  secret:  String(process.env.SECRET_KEY)
})

app.addHook("onRequest", async (request, reply) => {
  const tenant = request.headers["x-tenant"] as string || 'fullnext' ;
  if (!tenant) {
    return reply.status(400).send({ error: "Tenant (x-tenant) header is required" });
  }

  request.prisma = getPrismaClient(tenant);
});

app.register(translateRoutes);
app.register(authenticationRoutes);
app.register(usersRoutes);
app.register(menuLinkRoutes);
app.register(accessControlRoutes);
app.register(moduleRoutes);
app.register(reportUsageRoutes);
app.register(reportEmbedRoutes);
app.register(powerBiCredentialRoutes);
app.register(filterRoutes);
app.register(feedbackRoutes);
app.register(organizationRoutes);
app.register(paymentRoutes);

process.on("SIGINT", async () => {
  for (const client of Object.values(prismaClients)) {
    await client.$disconnect();
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  for (const client of Object.values(prismaClients)) {
    await client.$disconnect();
  }
  process.exit(0);
});

app
  .listen({
    host: '0.0.0.0',
    port: 3333,


  })
  .then(() => {
    const port = 3333
    console.log(`HTTP server running on http://localhost:${port}`);
  });

