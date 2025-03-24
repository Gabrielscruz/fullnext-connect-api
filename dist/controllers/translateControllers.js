"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslate = exports.translateSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const axios_1 = __importDefault(require("axios"));
exports.translateSchema = zod_1.z.object({
    text: zod_1.z.string(),
    language: zod_1.z.string(),
});
const prisma = (0, prisma_1.getPrismaClient)('fullnext_management');
const getTranslate = async (request, reply) => {
    const { text, language } = exports.translateSchema.parse(request.body);
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
        const apiUrl = `https://lingva.ml/api/v1/${language === "pt" ? "en" : "pt"}/${language === "pt" ? "pt" : language}/${encodeURIComponent(text)}`;
        const { data, status } = await axios_1.default.get(apiUrl);
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
    }
    catch (error) {
        reply.status(400).send(text);
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getTranslate = getTranslate;
//# sourceMappingURL=translateControllers.js.map