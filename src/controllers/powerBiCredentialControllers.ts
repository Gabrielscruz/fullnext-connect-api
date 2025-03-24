import { FastifyReply, FastifyRequest } from "fastify";
import { countPage, pagination } from "../utils/pagination";
import { powerBiCredentialByIdSchema, powerBiCredentialSchema } from "../schemas/powerBiCredentialSchemas";

export const getAllPowerBiCredential = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { limit, offset, ids} = pagination(request);
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
            totalPages: countPage(totalPowerBiCredential, limit),
            powerBiCredential
        });
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
};

export const getPowerBiCredentialById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { powerBiCredentialId } = powerBiCredentialByIdSchema.parse(request.params);
    try {
        const powerBiCredential = await request.prisma.powerBiCredential.findFirst({
            where: { id: Number(powerBiCredentialId) },
        });

        if (!powerBiCredential) {
            reply.status(404).send({ message: 'PowerBi Credential not found' });
            return;
        }

        reply.send({ powerBiCredential });
    } catch (error) {
        reply.status(400).send({ message: 'Invalid request', error });
    } finally {
        await request.prisma.$disconnect()
    }
};

export const createPowerBiCredential = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, clientId, clientSecret, tenantId } = powerBiCredentialSchema.parse(request.body)
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
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}

export const updatePowerBiCredential = async (request: FastifyRequest, reply: FastifyReply) => {
    const { powerBiCredentialId } = powerBiCredentialByIdSchema.parse(request.params);
    const { user } = request;
    const { name, clientId, clientSecret, tenantId } = powerBiCredentialSchema.parse(request.body)
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
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}


export const getPowerBiCredential = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const powerBiCredential = await request.prisma.powerBiCredential.findMany();
        reply.send(powerBiCredential);
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}