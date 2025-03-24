"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Configuração do servidor de e-mail incorreta.");
}
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: EMAIL_USER,
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado para: ${to}`);
    }
    catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw new Error("Erro ao enviar e-mail");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map