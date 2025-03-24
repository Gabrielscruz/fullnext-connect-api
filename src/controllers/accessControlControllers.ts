import { FastifyReply, FastifyRequest } from "fastify";
import { countPage, pagination } from "../utils/pagination";
import { AccessControlByIdSchema, accessControlSchema } from "../schemas/accessControlSchema";

export const getAllAccessControl = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { limit, offset, ids } = pagination(request);
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
            totalPages: countPage(totalAccessControl, limit),
            accessControl
        });
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect()
    }
};

export const getAllLinks = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const links = await request.prisma.menuLink.findMany({});

        reply.send(links);
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
};
export const createAccessControl = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { name, links } = accessControlSchema.parse(request.body);
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

        await Promise.all(links.map((link) => request.prisma.accessControlLink.create(
            {
                data: {
                    accessControlId: accessControl.id, menuLinkId: link.menuLinkId
                }
            })));

        reply.status(201).send({ message: 'Access Control created successfully', accessControl });

    } catch (error) {
        console.log(error)
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
};

export const getAccessControlById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const { accessControlId } = AccessControlByIdSchema.parse(request.params);

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
    } catch (error) {
        reply.status(400).send({ message: 'Invalid request', error });
    } finally {
        await request.prisma.$disconnect()
    }
};

export const updateAccessControl = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { accessControlId } = AccessControlByIdSchema.parse(request.params);
    const { name, links } = accessControlSchema.parse(request.body);
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
        })

        await Promise.all(links.map((link) => request.prisma.accessControlLink.create(
            {
                data: {
                    accessControlId: accessControl.id, menuLinkId: link.menuLinkId
                }
            })));

        reply.status(201).send({ message: 'Access Control updated successfully', accessControl });

    } catch (error) {
        console.log(error)
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
};

export const deleteAccessControl = async (request: FastifyRequest, reply: FastifyReply) => {
    const { accessControlId } = AccessControlByIdSchema.parse(request.params);

    try {
        // Exclui todos os links associados ao accessControlId
        await request.prisma.accessControlLink.deleteMany({
            where: {
                accessControlId: Number(accessControlId)
            }
        });

        // Exclui o próprio accessControl
        const accessControl = await request.prisma.accessControl.deleteMany({
            where: {
                id: Number(accessControlId)
            }
        });

        reply.send({ message: 'Access control deleted successfully', accessControl });
    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
};
