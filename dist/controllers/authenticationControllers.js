"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.verifyPasswordResetCode = exports.resetPassword = exports.authentication = void 0;
const authenticationSchemas_1 = require("../schemas/authenticationSchemas");
const md5_1 = __importDefault(require("md5"));
const prisma_1 = require("../lib/prisma");
const dotenv_1 = require("dotenv");
const tenant_1 = require("../utils/tenant");
const sendEmail_1 = require("../utils/sendEmail");
(0, dotenv_1.config)();
const authentication = async (request, reply) => {
    const { email, password, tenant = 'fullnext' } = authenticationSchemas_1.authSchema.parse(request.body);
    const prisma = (0, prisma_1.getPrismaClient)(tenant);
    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return reply.status(401).send({
                message: "Incorrect username or password. Please check your credentials and try again.",
            });
        }
        if ((0, md5_1.default)(password) !== user.passwordHash) {
            return reply.status(401).send({
                message: "Incorrect username or password. Please check your credentials and try again.",
            });
        }
        const subscriptionActive = await (0, tenant_1.getSubscriptionActive)(tenant);
        const token = request.server.jwt.sign({ ...user, subscriptionActive }, {
            sub: user.id.toString(),
            expiresIn: "1d",
        });
        reply.send({
            token,
        });
    }
    catch (error) {
        reply.status(500).send({
            message: "Internal server error",
        });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.authentication = authentication;
const resetPassword = async (request, reply) => {
    try {
        const { email, tenant } = authenticationSchemas_1.resetPasswordSchema.parse(request.body);
        const prisma = (0, prisma_1.getPrismaClient)(tenant);
        const user = await prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            return reply.status(404).send({
                message: "E-mail não encontrado. Verifique e tente novamente.",
            });
        }
        const code = Math.floor(1000 + Math.random() * 9000);
        const passwordReset = await prisma.passwordReset.findFirst({
            where: { email },
        });
        if (passwordReset) {
            await prisma.passwordReset.delete({
                where: {
                    email,
                }
            });
            await prisma.passwordReset.create({
                data: {
                    email,
                    codigo: `${code}`,
                    expiresAt: new Date()
                }
            });
        }
        else {
            await prisma.passwordReset.create({
                data: {
                    email,
                    codigo: `${code}`,
                    expiresAt: new Date()
                }
            });
        }
        const subject = "Código de Verificação";
        const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                background-color: #FF7F00;
                padding: 20px;
                border-radius: 8px;
                color: #ffffff;
              }
              .content {
                text-align: center;
                padding: 20px;
                font-size: 16px;
                color: #333333;
              }
              .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #888888;
              }
              .button {
                background-color: #FF7F00;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
              }
              .logo {
                width: 100%;
                max-width: 200px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1><strong>Fullnext Connect</strong></h1>
                <h2>Olá, ${user.name}!</h2>
                <p>Para continuar com o processo de recuperação de senha, utilize o código abaixo.</p>
              </div>
              <div class="content">
                <h2>Código de Verificação:</h2>
                <h3>${code}</h3>
                <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
                <p><a href="https://fullnext-connect.vercel.app/login" class="button">Ir para o site</a></p>
              </div>
              <div class="footer">
                <p>&copy; 2025 FullNext. Todos os direitos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        (0, sendEmail_1.sendEmail)(email, subject, html);
        return reply.status(200).send({ message: "E-mail enviado com sucesso." });
    }
    catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        return reply.status(500).send({ message: "Erro interno do servidor", error });
    }
};
exports.resetPassword = resetPassword;
const verifyPasswordResetCode = async (request, reply) => {
    try {
        const { email, tenant, codigo } = authenticationSchemas_1.validPasswordSchema.parse(request.body);
        const prisma = (0, prisma_1.getPrismaClient)(tenant);
        console.log(email, tenant, codigo);
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return reply.status(404).send({
                message: "Email not found. Please check and try again.",
            });
        }
        const passwordReset = await prisma.passwordReset.findFirst({
            where: { email },
        });
        if (!passwordReset) {
            return reply.status(400).send({ message: "No reset code found for this email." });
        }
        if (codigo !== passwordReset.codigo) {
            return reply.status(400).send({ message: "Invalid code. Please try again." });
        }
        if (passwordReset.expiresAt) {
            const now = new Date();
            const expirationDate = new Date(passwordReset.expiresAt);
            const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const expirationDateOnly = new Date(expirationDate.getFullYear(), expirationDate.getMonth(), expirationDate.getDate());
            if (expirationDateOnly < nowDate) {
                return reply.status(400).send({ message: "Code has expired. Please request a new one." });
            }
        }
        return reply.status(200).send({ message: "Valid code", codigo });
    }
    catch (error) {
        console.error("Error validating the recovery code:", error);
        return reply.status(500).send({ message: "Internal server error", error });
    }
};
exports.verifyPasswordResetCode = verifyPasswordResetCode;
const updatePassword = async (request, reply) => {
    try {
        const { email, tenant = 'fullnext', password } = authenticationSchemas_1.authSchema.parse(request.body);
        const prisma = (0, prisma_1.getPrismaClient)(tenant);
        const passwordHash = (0, md5_1.default)(password);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return reply.status(404).send({ message: "Email not found. Please check and try again." });
        }
        const passwordResetRecord = await prisma.passwordReset.findFirst({ where: { email } });
        if (!passwordResetRecord) {
            return reply.status(400).send({ message: "No reset code found for this email." });
        }
        await prisma.user.update({
            where: { email },
            data: { passwordHash: passwordHash },
        });
        await prisma.passwordReset.deleteMany({ where: { email } });
        return reply.status(200).send({ message: "Password successfully updated." });
    }
    catch (error) {
        console.error("Error resetting the password:", error);
        return reply.status(500).send({ message: "Internal server error", error: error.message });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=authenticationControllers.js.map