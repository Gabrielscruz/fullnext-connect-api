import { FastifyReply, FastifyRequest } from "fastify";
import { countPage, pagination } from "../utils/pagination";
import { moduleByIdSchema, moduleSchema } from "../schemas/moduleSchema";

export const getAllModule = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { limit, offset, ids } = pagination(request);
    try {
        const totalModule = await request.prisma.module.count({
            where: ids.length > 0 ? { id: { in: ids } } : undefined
        });

        const modules = await request.prisma.module.findMany({
            skip: offset,
            take: limit,
            where: ids.length > 0 ? { id: { in: ids } } : undefined
        });

        reply.send({
            totalPages: countPage(totalModule, limit),
            modules
        });
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
};

export const getModuleById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const { moduleId } = moduleByIdSchema.parse(request.params);

        const module = await request.prisma.module.findFirst({
            where: { id: Number(moduleId) },
        });

        if (!module) {
            reply.status(404).send({ message: 'User not found' });
            return;
        }

        reply.send({ module });
    } catch (error) {
        reply.status(400).send({ message: 'Invalid request', error });
    } finally {
        await request.prisma.$disconnect()
    }
};

export const createModule = async (request: FastifyRequest, reply: FastifyReply) => {
    const { title, activeIcon, defaultIcon } = moduleSchema.parse(request.body)
    try {

        const module = await request.prisma.module.create({
            data: {
                title,
                activeIcon,
                defaultIcon
            }
        });
        reply.status(200).send({ message: 'Module created successfully', module });
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}

export const updateModule = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { moduleId } = moduleByIdSchema.parse(request.params);
    const { title, defaultIcon, activeIcon } = moduleSchema.parse(request.body)
    try {

        const existingModule = await request.prisma.module.findFirst({
            where: {
                title,
                id: {
                    not: Number(moduleId)
                }
            }
        });

        if (existingModule) {
            return reply.status(400).send({ message: 'Module already exists' });
        }
        const module = await request.prisma.module.update({
            data: {
                title,
                defaultIcon,
                activeIcon,
            },
            where: {
                id: Number(moduleId)
            }
        });
        reply.status(201).send({ message: 'Module updated successfully', module });
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}


export const deleteModule = async (request: FastifyRequest, reply: FastifyReply) => {
    const { moduleId } = moduleByIdSchema.parse(request.params);
    try {
        const module = await request.prisma.module.delete({
            where: {
                id: Number(moduleId)
            }
        });
        reply.send({ module });
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}