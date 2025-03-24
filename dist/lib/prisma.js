"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClients = void 0;
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.prismaClients = {};
function getPrismaClient(tenant) {
    const dbname = tenant || "fullnext";
    const DATABASE_URL = process.env.DATABASE_URL?.replace("<dbname>", dbname);
    if (!DATABASE_URL) {
        throw new Error("A DATABASE_URL não está configurada corretamente no .env");
    }
    if (!exports.prismaClients[dbname]) {
        exports.prismaClients[dbname] = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: DATABASE_URL,
                },
            },
        });
    }
    return exports.prismaClients[dbname];
}
//# sourceMappingURL=prisma.js.map