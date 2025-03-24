"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadfeedback = exports.feedback = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const path_1 = require("path");
const feedbackSchema_1 = require("../schemas/feedbackSchema");
const pump = (0, node_util_1.promisify)(node_stream_1.pipeline);
const feedback = async (request, reply) => {
    const { user } = request;
    const { type, title, comment } = feedbackSchema_1.feedbackSchema.parse(request.body);
    try {
        const feedback = await request.prisma.feedback.create({
            data: {
                type,
                title,
                comment,
                createdAtUserId: user.id
            },
        });
        return reply.status(201).send(feedback);
    }
    catch (error) {
        console.log(error);
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.feedback = feedback;
const uploadfeedback = async (request, reply) => {
    const { feedbackId } = feedbackSchema_1.feedbackIdSchema.parse(request.params);
    try {
        const upload = await request.file({
            limits: {
                fileSize: 5_242_880,
            },
        });
        if (upload) {
            const feedback = await request.prisma.feedback.findFirst({
                where: {
                    id: Number(feedbackId)
                }
            });
            if (feedback?.url)
                await (0, fs_1.unlinkSync)(feedback?.url);
            const fileId = (0, crypto_1.randomUUID)();
            const extension = (0, path_1.extname)(upload.filename);
            const fileName = fileId.concat(extension);
            const writeStream = (0, fs_1.createWriteStream)((0, path_1.resolve)(__dirname, "../../uploads/", fileName));
            await pump(upload.file, writeStream);
            await request.prisma.feedback.update({
                data: {
                    url: `./uploads/${fileName}`,
                },
                where: {
                    id: Number(feedbackId),
                }
            });
        }
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.uploadfeedback = uploadfeedback;
//# sourceMappingURL=feedbackControllers.js.map