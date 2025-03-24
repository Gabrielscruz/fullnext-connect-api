"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModule = exports.updateModule = exports.createModule = exports.getModuleById = exports.getAllModule = void 0;
const pagination_1 = require("../utils/pagination");
const moduleSchema_1 = require("../schemas/moduleSchema");
const getAllModule = async (request, reply) => {
    const { limit, offset, ids } = (0, pagination_1.pagination)(request);
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
            totalPages: (0, pagination_1.countPage)(totalModule, limit),
            modules
        });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllModule = getAllModule;
const getModuleById = async (request, reply) => {
    try {
        const { moduleId } = moduleSchema_1.moduleByIdSchema.parse(request.params);
        const module = await request.prisma.module.findFirst({
            where: { id: Number(moduleId) },
        });
        if (!module) {
            reply.status(404).send({ message: 'User not found' });
            return;
        }
        reply.send({ module });
    }
    catch (error) {
        reply.status(400).send({ message: 'Invalid request', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getModuleById = getModuleById;
const createModule = async (request, reply) => {
    const { title, activeIcon, defaultIcon } = moduleSchema_1.moduleSchema.parse(request.body);
    try {
        const module = await request.prisma.module.create({
            data: {
                title,
                activeIcon,
                defaultIcon
            }
        });
        reply.status(200).send({ message: 'Module created successfully', module });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.createModule = createModule;
const updateModule = async (request, reply) => {
    const { moduleId } = moduleSchema_1.moduleByIdSchema.parse(request.params);
    const { title, defaultIcon, activeIcon } = moduleSchema_1.moduleSchema.parse(request.body);
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
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.updateModule = updateModule;
const deleteModule = async (request, reply) => {
    const { moduleId } = moduleSchema_1.moduleByIdSchema.parse(request.params);
    try {
        const module = await request.prisma.module.delete({
            where: {
                id: Number(moduleId)
            }
        });
        reply.send({ module });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.deleteModule = deleteModule;
//# sourceMappingURL=moduleControllers.js.map