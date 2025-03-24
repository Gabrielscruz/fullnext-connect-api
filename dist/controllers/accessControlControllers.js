"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccessControl = exports.updateAccessControl = exports.getAccessControlById = exports.createAccessControl = exports.getAllLinks = exports.getAllAccessControl = void 0;
const pagination_1 = require("../utils/pagination");
const accessControlSchema_1 = require("../schemas/accessControlSchema");
const getAllAccessControl = async (request, reply) => {
    const { limit, offset, ids } = (0, pagination_1.pagination)(request);
    try {
        const totalAccessControl = await request.prisma.accessControl.count({
            where: ids.length > 0 ? { id: { in: ids } } : undefined,
        });
        const accessControl = await request.prisma.accessControl.findMany({
            include: {
                accessLinks: true
            },
            where: ids.length > 0 ? { id: { in: ids } } : undefined,
            skip: offset,
            take: limit,
        });
        reply.send({
            totalPages: (0, pagination_1.countPage)(totalAccessControl, limit),
            accessControl
        });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllAccessControl = getAllAccessControl;
const getAllLinks = async (request, reply) => {
    try {
        const links = await request.prisma.menuLink.findMany({});
        reply.send(links);
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllLinks = getAllLinks;
const createAccessControl = async (request, reply) => {
    const { name, links } = accessControlSchema_1.accessControlSchema.parse(request.body);
    try {
        const existingAccessControl = await request.prisma.accessControl.findFirst({
            where: {
                name
            }
        });
        if (existingAccessControl) {
            return reply.status(400).send({ message: 'Access Control already exists' });
        }
        const accessControl = await request.prisma.accessControl.create({
            data: {
                name
            }
        });
        await Promise.all(links.map((link) => request.prisma.accessControlLink.create({
            data: {
                accessControlId: accessControl.id, menuLinkId: link.menuLinkId
            }
        })));
        reply.status(201).send({ message: 'Access Control created successfully', accessControl });
    }
    catch (error) {
        console.log(error);
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.createAccessControl = createAccessControl;
const getAccessControlById = async (request, reply) => {
    try {
        const { accessControlId } = accessControlSchema_1.AccessControlByIdSchema.parse(request.params);
        const accessControl = await request.prisma.accessControl.findFirst({
            include: {
                accessLinks: true
            },
            where: { id: Number(accessControlId) },
        });
        if (!accessControl) {
            reply.status(404).send({ message: 'Category not found' });
            return;
        }
        reply.send({ accessControl });
    }
    catch (error) {
        reply.status(400).send({ message: 'Invalid request', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAccessControlById = getAccessControlById;
const updateAccessControl = async (request, reply) => {
    const { accessControlId } = accessControlSchema_1.AccessControlByIdSchema.parse(request.params);
    const { name, links } = accessControlSchema_1.accessControlSchema.parse(request.body);
    try {
        const existingAccessControl = await request.prisma.accessControl.findFirst({
            where: {
                name,
                id: {
                    not: Number(accessControlId)
                }
            }
        });
        if (existingAccessControl) {
            return reply.status(400).send({ message: 'Access Control already exists' });
        }
        const accessControl = await request.prisma.accessControl.update({
            data: {
                name
            },
            where: {
                id: Number(accessControlId)
            }
        });
        await request.prisma.accessControlLink.deleteMany({
            where: {
                accessControlId: Number(accessControlId)
            }
        });
        await Promise.all(links.map((link) => request.prisma.accessControlLink.create({
            data: {
                accessControlId: accessControl.id, menuLinkId: link.menuLinkId
            }
        })));
        reply.status(201).send({ message: 'Access Control updated successfully', accessControl });
    }
    catch (error) {
        console.log(error);
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.updateAccessControl = updateAccessControl;
const deleteAccessControl = async (request, reply) => {
    const { accessControlId } = accessControlSchema_1.AccessControlByIdSchema.parse(request.params);
    try {
        await request.prisma.accessControlLink.deleteMany({
            where: {
                accessControlId: Number(accessControlId)
            }
        });
        const accessControl = await request.prisma.accessControl.deleteMany({
            where: {
                id: Number(accessControlId)
            }
        });
        reply.send({ message: 'Access control deleted successfully', accessControl });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.deleteAccessControl = deleteAccessControl;
//# sourceMappingURL=accessControlControllers.js.map