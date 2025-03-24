"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRecentAccess = exports.getAllFavorite = exports.InsertOrDeleteFavoriteById = exports.DeleteRecentById = exports.InsertRecentById = exports.createUserLinkUsage = exports.menuLinkValidation = exports.getModuleMenuLink = exports.findBySearchLink = exports.getLinkById = exports.deleteLink = exports.updateLink = exports.createLink = exports.getAllPowerBiLinks = exports.getAccessControl = exports.getMenuLinks = void 0;
const menuLinkSchema_1 = require("../schemas/menuLinkSchema");
const pagination_1 = require("../utils/pagination");
const getMenuLinks = async (request, reply) => {
    const { user } = request;
    try {
        const modulesWithAccess = await request.prisma.module.findMany({
            include: {
                MenuLink: {
                    where: {
                        AccessControlLink: {
                            some: {
                                accessControlId: {
                                    in: [user.accessControlId]
                                },
                            },
                        },
                    },
                    orderBy: {
                        moduleId: 'asc',
                    },
                    include: {
                        AccessControlLink: true,
                        FavoriteLink: true,
                        RecentAccess: true
                    },
                },
            },
        });
        const filteredModules = modulesWithAccess.filter(module => module.MenuLink.length > 0);
        const sortedModules = filteredModules.sort((a, b) => {
            if (a.title === 'Config')
                return 1;
            if (b.title === 'Config')
                return -1;
            return a.id - b.id;
        });
        reply.send(sortedModules);
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getMenuLinks = getMenuLinks;
const getAccessControl = async (request, reply) => {
    try {
        const accessControl = await request.prisma.accessControl.findMany();
        reply.send(accessControl);
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAccessControl = getAccessControl;
const getAllPowerBiLinks = async (request, reply) => {
    const { limit, offset, ids } = (0, pagination_1.pagination)(request);
    try {
        const totalLinks = await request.prisma.menuLink.count({
            where: ids.length > 0 ? { id: { in: ids } } : undefined
        });
        const links = await request.prisma.menuLink.findMany({
            include: {
                module: true,
                menuLinkType: true
            },
            where: ids.length > 0 ? { id: { in: ids } } : undefined,
            skip: offset,
            take: limit,
        });
        reply.send({
            totalPages: (0, pagination_1.countPage)(totalLinks, limit),
            links
        });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllPowerBiLinks = getAllPowerBiLinks;
const createLink = async (request, reply) => {
    const { label, href, defaultIcon, activeIcon, selectedModule, selectedCredential, selectedType } = menuLinkSchema_1.menuLinkSchema.parse(request.body);
    try {
        const existingLink = await request.prisma.menuLink.findFirst({
            where: { label }
        });
        if (existingLink) {
            return reply.status(400).send({ message: 'PowerBI Link already exists' });
        }
        const accessControl = await request.prisma.accessControl.findFirst({
            where: {
                name: 'Admin'
            }
        });
        if (!accessControl) {
            return reply.status(400).send({ message: 'No access control found' });
        }
        const result = await request.prisma.$transaction(async (prisma) => {
            const menuLink = await prisma.menuLink.create({
                data: {
                    label,
                    href,
                    defaultIcon,
                    activeIcon,
                    moduleId: selectedModule.value,
                    powerBiCredentialId: selectedCredential.value,
                    type: selectedType.value,
                    order: 0
                }
            });
            await prisma.accessControlLink.create({
                data: {
                    accessControlId: accessControl.id,
                    menuLinkId: menuLink.id
                }
            });
            return menuLink;
        });
        reply.status(200).send({ message: 'PowerBI Link created successfully', menuLink: result });
    }
    catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.createLink = createLink;
const updateLink = async (request, reply) => {
    const { linkId } = menuLinkSchema_1.linkByIdSchema.parse(request.params);
    const { label, href, defaultIcon, activeIcon, selectedModule, selectedCredential, selectedType } = menuLinkSchema_1.menuLinkSchema.parse(request.body);
    try {
        const existinglink = await request.prisma.menuLink.findFirst({
            where: {
                label,
                id: {
                    not: Number(linkId)
                }
            }
        });
        if (existinglink) {
            return reply.status(400).send({ message: 'PowerBI Link already exists' });
        }
        const menuLink = await request.prisma.menuLink.update({
            data: {
                label,
                href,
                defaultIcon,
                activeIcon,
                moduleId: selectedModule.value,
                powerBiCredentialId: selectedCredential.value,
                type: selectedType.value,
                order: 0
            },
            where: {
                id: Number(linkId)
            }
        });
        reply.status(201).send({ message: 'PowerBI Link updated successfully', menuLink });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.updateLink = updateLink;
const deleteLink = async (request, reply) => {
    const { linkId } = menuLinkSchema_1.linkByIdSchema.parse(request.params);
    try {
        await request.prisma.accessControlLink.deleteMany({
            where: {
                menuLinkId: Number(linkId)
            }
        });
        await request.prisma.favoriteLink.deleteMany({
            where: {
                menuLinkId: Number(linkId)
            }
        });
        await request.prisma.recentAccess.deleteMany({
            where: {
                menuLinkId: Number(linkId)
            }
        });
        await request.prisma.userLinkUsage.deleteMany({
            where: {
                menuLinkId: Number(linkId)
            }
        });
        const menuLink = await request.prisma.menuLink.delete({
            where: {
                id: Number(linkId)
            }
        });
        reply.send({ menuLink });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.deleteLink = deleteLink;
const getLinkById = async (request, reply) => {
    try {
        const { linkId } = menuLinkSchema_1.linkByIdSchema.parse(request.params);
        const link = await request.prisma.menuLink.findFirst({
            where: { id: Number(linkId) },
            include: {
                menuLinkType: true,
                module: true,
                powerBiCredential: true
            }
        });
        if (!link) {
            reply.status(404).send({ message: 'Link not found' });
            return;
        }
        reply.send({ link });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getLinkById = getLinkById;
const findBySearchLink = async (request, reply) => {
    try {
        const { user } = request;
        const { searchTerm } = menuLinkSchema_1.linkBySearchSchema.parse(request.params);
        const menuLinkWithAccess = await request.prisma.menuLink.findMany({
            where: {
                label: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
                AccessControlLink: {
                    some: {
                        accessControlId: {
                            in: [user.accessControlId],
                        },
                    },
                },
            },
        });
        reply.send(menuLinkWithAccess);
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.findBySearchLink = findBySearchLink;
const getModuleMenuLink = async (request, reply) => {
    try {
        const module = await request.prisma.module.findMany();
        reply.send(module);
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getModuleMenuLink = getModuleMenuLink;
const menuLinkValidation = async (request, reply) => {
    const { path } = request.query;
    const { user } = request;
    try {
        const menuLinks = await request.prisma.menuLink.findMany({
            select: {
                id: true,
                type: true,
                href: true,
            },
            where: {
                AccessControlLink: {
                    some: {
                        accessControlId: {
                            in: [user.accessControlId],
                        },
                    },
                },
            },
            orderBy: {
                order: 'asc',
            },
        });
        const matchingLink = menuLinks.find((menuLink) => {
            if (menuLink.type === 2) {
                return path.includes(String(menuLink.id));
            }
            if (menuLink.type === 3) {
                return path.includes(String(menuLink.id));
            }
            return path.includes(menuLink.href);
        });
        reply.send({
            permission: Boolean(matchingLink),
            menuLinkId: matchingLink?.id || null,
        });
    }
    catch (error) {
        reply.status(500).send({
            message: 'Internal server error during menu link validation',
            error: error.message || error,
        });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.menuLinkValidation = menuLinkValidation;
const createUserLinkUsage = async (request, reply) => {
    const { user } = request;
    const { menuLinkId, duration } = menuLinkSchema_1.userLinkUsageSchema.parse(request.body);
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    try {
        const userLinkUsage = await request.prisma.userLinkUsage.create({
            data: {
                menuLinkId,
                userId: user.id,
                ip: String(ip),
                duration
            }
        });
        reply.status(200).send({ message: 'userLinkUsage created successfully', userLinkUsage });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.createUserLinkUsage = createUserLinkUsage;
const InsertRecentById = async (request, reply) => {
    try {
        const { linkId } = menuLinkSchema_1.linkByIdSchema.parse(request.params);
        const { user } = request;
        if (!user) {
            return reply.status(401).send({ message: "User not authenticated" });
        }
        const recentAccess = await request.prisma.recentAccess.findFirst({
            where: { menuLinkId: Number(linkId), userId: user.id },
        });
        if (!recentAccess) {
            await request.prisma.recentAccess.create({
                data: {
                    userId: user.id,
                    menuLinkId: Number(linkId),
                    query: "",
                },
            });
        }
    }
    catch (error) {
        console.error("Error:", error);
        reply.status(400).send({ message: "Invalid request", error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.InsertRecentById = InsertRecentById;
const DeleteRecentById = async (request, reply) => {
    try {
        const { linkId } = menuLinkSchema_1.linkByIdSchema.parse(request.params);
        const { user } = request;
        if (!user) {
            return reply.status(401).send({ message: "User not authenticated" });
        }
        const recentAccess = await request.prisma.recentAccess.findFirst({
            where: { menuLinkId: Number(linkId), userId: user.id },
        });
        if (recentAccess) {
            await request.prisma.recentAccess.deleteMany({
                where: { menuLinkId: Number(linkId), userId: user.id },
            });
        }
    }
    catch (error) {
        console.error("Error:", error);
        reply.status(400).send({ message: "Invalid request", error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.DeleteRecentById = DeleteRecentById;
const InsertOrDeleteFavoriteById = async (request, reply) => {
    try {
        const { linkId } = menuLinkSchema_1.linkByIdSchema.parse(request.params);
        const { user } = request;
        if (!user) {
            return reply.status(401).send({ message: "User not authenticated" });
        }
        const favoriteLink = await request.prisma.favoriteLink.findFirst({
            where: { menuLinkId: Number(linkId), userId: user.id },
        });
        if (!favoriteLink) {
            await request.prisma.favoriteLink.create({
                data: {
                    userId: user.id,
                    menuLinkId: Number(linkId),
                    query: "",
                },
            });
        }
        else {
            await request.prisma.favoriteLink.delete({
                where: {
                    id: favoriteLink.id,
                },
            });
        }
        reply.send({ favoriteLink: !favoriteLink });
    }
    catch (error) {
        console.error("Error:", error);
        reply.status(400).send({ message: "Invalid request", error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.InsertOrDeleteFavoriteById = InsertOrDeleteFavoriteById;
const getAllFavorite = async (request, reply) => {
    const { user } = request;
    try {
        const favoriteLink = await request.prisma.favoriteLink.findMany({
            include: {
                menuLink: {
                    include: {
                        module: true
                    }
                }
            },
            where: { userId: user.id },
        });
        reply.send(favoriteLink);
    }
    catch (error) {
        reply.status(400).send({ message: "Invalid request", error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllFavorite = getAllFavorite;
const getAllRecentAccess = async (request, reply) => {
    const { limit, offset } = (0, pagination_1.pagination)(request);
    const { user } = request;
    try {
        const totalrecentAccess = await request.prisma.recentAccess.count({
            where: {
                userId: user.id
            }
        });
        const recentAccess = await request.prisma.recentAccess.findMany({
            include: {
                menuLink: {
                    include: {
                        module: true,
                        FavoriteLink: true
                    }
                }
            },
            where: { userId: user.id },
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc'
            }
        });
        reply.send({
            totalPages: (0, pagination_1.countPage)(totalrecentAccess, limit),
            recentAccess
        });
    }
    catch (error) {
        reply.status(400).send({ message: "Invalid request", error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllRecentAccess = getAllRecentAccess;
//# sourceMappingURL=menuLinkControllers.js.map