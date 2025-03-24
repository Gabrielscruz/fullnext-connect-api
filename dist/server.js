"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const path_1 = require("path");
const authenticationRoutes_1 = require("./routes/authenticationRoutes");
const usersRoutes_1 = require("./routes/usersRoutes");
const menuLinkRoutes_1 = require("./routes/menuLinkRoutes");
const accessControlRoutes_1 = require("./routes/accessControlRoutes");
const moduleRoutes_1 = require("./routes/moduleRoutes");
const reportUsageRoutes_1 = require("./routes/reportUsageRoutes");
const reportEmbedRoutes_1 = require("./routes/reportEmbedRoutes");
const powerBiCredentialRoutes_1 = require("./routes/powerBiCredentialRoutes");
const filterRoutes_1 = require("./routes/filterRoutes");
const prisma_1 = require("./lib/prisma");
const dotenv_1 = require("dotenv");
const feedbackRoutes_1 = require("./routes/feedbackRoutes");
const translateRoutes_1 = require("./routes/translateRoutes");
const organizationRoutes_1 = require("./routes/organizationRoutes");
const paymentRoutes_1 = require("./routes/paymentRoutes");
(0, dotenv_1.config)();
exports.app = (0, fastify_1.default)();
exports.app.register(multipart_1.default);
exports.app.register(require('@fastify/static'), {
    root: (0, path_1.resolve)(__dirname, '../uploads'),
    prefix: '/uploads',
});
exports.app.register(cors_1.default, {
    origin: [
        'https://fullnext-connect.vercel.app',
        'http://localhost:3000',
        /^http:\/\/[\w-]+\.localhost:\d+$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATH', 'DELETE', 'OPTIONS'],
    credentials: true
});
exports.app.register(jwt_1.default, {
    secret: String(process.env.SECRET_KEY)
});
exports.app.addHook("onRequest", async (request, reply) => {
    const tenant = request.headers["x-tenant"] || 'fullnext';
    if (!tenant) {
        return reply.status(400).send({ error: "Tenant (x-tenant) header is required" });
    }
    request.prisma = (0, prisma_1.getPrismaClient)(tenant);
});
exports.app.register(translateRoutes_1.translateRoutes);
exports.app.register(authenticationRoutes_1.authenticationRoutes);
exports.app.register(usersRoutes_1.usersRoutes);
exports.app.register(menuLinkRoutes_1.menuLinkRoutes);
exports.app.register(accessControlRoutes_1.accessControlRoutes);
exports.app.register(moduleRoutes_1.moduleRoutes);
exports.app.register(reportUsageRoutes_1.reportUsageRoutes);
exports.app.register(reportEmbedRoutes_1.reportEmbedRoutes);
exports.app.register(powerBiCredentialRoutes_1.powerBiCredentialRoutes);
exports.app.register(filterRoutes_1.filterRoutes);
exports.app.register(feedbackRoutes_1.feedbackRoutes);
exports.app.register(organizationRoutes_1.organizationRoutes);
exports.app.register(paymentRoutes_1.paymentRoutes);
process.on("SIGINT", async () => {
    for (const client of Object.values(prisma_1.prismaClients)) {
        await client.$disconnect();
    }
    process.exit(0);
});
process.on("SIGTERM", async () => {
    for (const client of Object.values(prisma_1.prismaClients)) {
        await client.$disconnect();
    }
    process.exit(0);
});
exports.app
    .listen({
    host: '0.0.0.0',
    port: 3333,
})
    .then(() => {
    const port = 3333;
    console.log(`HTTP server running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map