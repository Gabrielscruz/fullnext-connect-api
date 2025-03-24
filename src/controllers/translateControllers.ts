import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPrismaClient } from "../lib/prisma";
import axios from "axios";

export const translateSchema = z.object({
    text: z.string(),
    language: z.string(),
})

const prisma = getPrismaClient('fullnext_management');

export const getTranslate = async (request: FastifyRequest, reply: FastifyReply) => {
    const { text, language } = translateSchema.parse(request.body);
    try {
        const existingTranslation = await prisma.translate.findFirst({
            where: {
                text,
                language,
            },
        });

        if (existingTranslation) {
            return reply.status(200).send(existingTranslation.translate);
        }


        //const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${language === 'pt' ? 'en' : 'pt-BR'}|${language === 'pt'? 'pt-BR': language}`;
        const apiUrl = `https://lingva.ml/api/v1/${language === "pt" ? "en" : "pt"}/${language === "pt" ? "pt" : language}/${encodeURIComponent(text)}`
        const { data, status } = await axios.get(apiUrl);
        if (status === 200) {
            const translatedText = data.translation;

            await prisma.translate.create({
                data: {
                    text,
                    language,
                    translate: translatedText,
                },
            });

            return reply.status(201).send(translatedText);
        }

        reply.status(400).send(text);
    } catch (error) {
        reply.status(400).send(text);
    }
    finally {
        await request.prisma.$disconnect()
    }
};