"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = exports.getUserProfile = exports.deleteUser = exports.uploadUser = exports.updateUser = exports.createUser = exports.getAllUsers = exports.getUserById = void 0;
const userSchemas_1 = require("../schemas/userSchemas");
const fs_1 = require("fs");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const path_1 = require("path");
const crypto_1 = require("crypto");
const md5_1 = __importDefault(require("md5"));
const pagination_1 = require("../utils/pagination");
const pump = (0, node_util_1.promisify)(node_stream_1.pipeline);
const getUserById = async (request, reply) => {
    try {
        const { userId } = userSchemas_1.userByIdSchema.parse(request.params);
        const user = await request.prisma.user.findFirst({
            where: { id: Number(userId) },
            include: {
                accessControl: true,
            }
        });
        if (!user) {
            reply.status(404).send({ message: 'User not found' });
            return;
        }
        reply.send({ user });
    }
    catch (error) {
        reply.status(400).send({ message: 'Invalid request', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getUserById = getUserById;
const getAllUsers = async (request, reply) => {
    const { limit, offset, ids = [] } = (0, pagination_1.pagination)(request);
    try {
        const totalUsers = await request.prisma.user.count({
            where: ids.length > 0 ? { id: { in: ids } } : undefined,
        });
        const users = await request.prisma.user.findMany({
            include: {
                accessControl: true,
            },
            where: ids.length > 0 ? { id: { in: ids } } : undefined,
            skip: offset,
            take: limit,
        });
        reply.send({
            totalPages: (0, pagination_1.countPage)(totalUsers, limit),
            users
        });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (request, reply) => {
    const { name, email, accessControl, dateOfBirth, password, about } = userSchemas_1.userCreateSchema.parse(request.body);
    try {
        const passwordHash = (0, md5_1.default)(password);
        const user = await request.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                dateOfBirth: new Date(dateOfBirth),
                accessControlId: accessControl?.value,
                about
            }
        });
        reply.send({ user });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.createUser = createUser;
const updateUser = async (request, reply) => {
    const { userId } = userSchemas_1.userByIdSchema.parse(request.params);
    const { name, email, accessControl, dateOfBirth, password, about, updatePassword } = userSchemas_1.userUpdateSchema.parse(request.body);
    try {
        if (updatePassword) {
            const passwordHash = password ? (0, md5_1.default)(password) : undefined;
            if (passwordHash) {
                const user = await request.prisma.user.update({
                    data: {
                        name,
                        email,
                        passwordHash,
                        dateOfBirth: new Date(dateOfBirth),
                        accessControlId: accessControl?.value,
                        about
                    },
                    where: {
                        id: Number(userId)
                    }
                });
                reply.send({ user });
            }
        }
        else {
            const user = await request.prisma.user.update({
                data: {
                    name,
                    email,
                    dateOfBirth: new Date(dateOfBirth),
                    accessControlId: accessControl?.value,
                    about
                },
                where: {
                    id: Number(userId)
                }
            });
            reply.send({ user });
        }
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.updateUser = updateUser;
const uploadUser = async (request, reply) => {
    const { userId } = userSchemas_1.userByIdSchema.parse(request.params);
    try {
        const upload = await request.file({
            limits: {
                fileSize: 5_242_880,
            },
        });
        if (!upload) {
            return reply.status(400).send({ message: 'No file uploaded' });
        }
        const fileId = (0, crypto_1.randomUUID)();
        const extension = (0, path_1.extname)(upload.filename);
        const fileName = fileId.concat(extension);
        const filePath = (0, path_1.resolve)(__dirname, "../../uploads/", fileName);
        const writeStream = (0, fs_1.createWriteStream)(filePath);
        await pump(upload.file, writeStream);
        await request.prisma.user.update({
            data: {
                profileUrl: `./uploads/${fileName}`,
            },
            where: {
                id: Number(userId),
            },
        });
        reply.status(200).send({ message: 'File uploaded successfully', fileUrl: `./uploads/${fileName}` });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error: error.message });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.uploadUser = uploadUser;
const deleteUser = async (request, reply) => {
    const { userId } = userSchemas_1.userByIdSchema.parse(request.params);
    try {
        const user = await request.prisma.user.delete({
            where: {
                id: Number(userId)
            }
        });
        reply.send({ user });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.deleteUser = deleteUser;
const getUserProfile = async (request, reply) => {
    const user = request.user;
    try {
        const userData = await request.prisma.user.findFirst({
            where: {
                id: Number(user.id)
            }
        });
        reply.send({ user: userData });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getUserProfile = getUserProfile;
const userProfile = async (request, reply) => {
    const { name, isUpdatePassword, password, about } = userSchemas_1.userProfileSchema.parse(request.body);
    try {
        if (isUpdatePassword) {
            const passwordHash = (0, md5_1.default)(password);
            const user = await request.prisma.user.update({
                data: {
                    name,
                    about,
                    firstAccess: false,
                    passwordHash
                },
                where: {
                    id: Number(request.user.id)
                }
            });
            reply.send({ user });
        }
        const user = await request.prisma.user.update({
            data: {
                name,
                about
            },
            where: {
                id: Number(request.user.id)
            }
        });
        reply.send({ user });
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.userProfile = userProfile;
//# sourceMappingURL=usersControllers.js.map