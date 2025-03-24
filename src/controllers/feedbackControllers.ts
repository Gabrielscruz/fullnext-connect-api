import { randomUUID } from "crypto";
import { createWriteStream, unlinkSync } from "fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { extname, resolve } from "path";
import { FastifyReply, FastifyRequest } from "fastify";
import { feedbackIdSchema, feedbackSchema } from "../schemas/feedbackSchema";

const pump = promisify(pipeline);

export const feedback = async (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = request;
    const { type, title, comment } = feedbackSchema.parse(request.body);

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
    } catch (error) {
        console.log(error)
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}

export const uploadfeedback = async (request: FastifyRequest, reply: FastifyReply) => {
    const {
        feedbackId
    } = feedbackIdSchema.parse(request.params);
    try {
        const upload = await request.file({
            limits: {
                fileSize: 5_242_880, // 5mb
            },
        });

        if (upload) {
            const feedback = await request.prisma.feedback.findFirst({
                where: {
                    id: Number(feedbackId)
                }
            })
            if (feedback?.url) await unlinkSync(feedback?.url);
            const fileId = randomUUID();
            const extension = extname(upload.filename);
            const fileName = fileId.concat(extension);
            const writeStream = createWriteStream(
                resolve(__dirname, "../../uploads/", fileName)
            );

            // Realiza o upload do arquivo
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

    } catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    } finally {
        await request.prisma.$disconnect()
    }
}