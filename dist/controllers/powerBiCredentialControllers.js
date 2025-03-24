"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPowerBiCredential = exports.updatePowerBiCredential = exports.createPowerBiCredential = exports.getPowerBiCredentialById = exports.getAllPowerBiCredential = void 0;
const pagination_1 = require("../utils/pagination");
const powerBiCredentialSchemas_1 = require("../schemas/powerBiCredentialSchemas");
const getAllPowerBiCredential = async (request, reply) => {
    const { limit, offset, ids } = (0, pagination_1.pagination)(request);
    try {
        const totalPowerBiCredential = await request.prisma.powerBiCredential.count({
            where: ids.length > 0 ? { id: { in: ids } } : undefined,
        });
        const powerBiCredential = await request.prisma.powerBiCredential.findMany({
            where: ids.length > 0 ? { id: { in: ids } } : undefined,
            skip: offset,
            take: limit,
        });
        reply.send({
            totalPages: (0, pagination_1.countPage)(totalPowerBiCredential, limit),
            powerBiCredential
        });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllPowerBiCredential = getAllPowerBiCredential;
const getPowerBiCredentialById = async (request, reply) => {
    const { powerBiCredentialId } = powerBiCredentialSchemas_1.powerBiCredentialByIdSchema.parse(request.params);
    try {
        const powerBiCredential = await request.prisma.powerBiCredential.findFirst({
            where: { id: Number(powerBiCredentialId) },
        });
        if (!powerBiCredential) {
            reply.status(404).send({ message: 'PowerBi Credential not found' });
            return;
        }
        reply.send({ powerBiCredential });
    }
    catch (error) {
        reply.status(400).send({ message: 'Invalid request', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getPowerBiCredentialById = getPowerBiCredentialById;
const createPowerBiCredential = async (request, reply) => {
    const { name, clientId, clientSecret, tenantId } = powerBiCredentialSchemas_1.powerBiCredentialSchema.parse(request.body);
    const { user } = request;
    try {
        const powerBiCredential = await request.prisma.powerBiCredential.create({
            data: {
                name,
                clientId,
                clientSecret,
                tenantId,
                createdAtUserId: user.id
            }
        });
        reply.status(200).send({ message: 'PowerBiCredential created successfully', powerBiCredential });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.createPowerBiCredential = createPowerBiCredential;
const updatePowerBiCredential = async (request, reply) => {
    const { powerBiCredentialId } = powerBiCredentialSchemas_1.powerBiCredentialByIdSchema.parse(request.params);
    const { user } = request;
    const { name, clientId, clientSecret, tenantId } = powerBiCredentialSchemas_1.powerBiCredentialSchema.parse(request.body);
    try {
        const powerBiCredential = await request.prisma.powerBiCredential.update({
            data: {
                name,
                clientId,
                clientSecret,
                tenantId,
                updatedAtUserId: user.id
            },
            where: {
                id: Number(powerBiCredentialId)
            }
        });
        reply.status(200).send({ message: 'PowerBiCredential updated successfully', powerBiCredential });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.updatePowerBiCredential = updatePowerBiCredential;
const getPowerBiCredential = async (request, reply) => {
    try {
        const powerBiCredential = await request.prisma.powerBiCredential.findMany();
        reply.send(powerBiCredential);
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getPowerBiCredential = getPowerBiCredential;
//# sourceMappingURL=powerBiCredentialControllers.js.map