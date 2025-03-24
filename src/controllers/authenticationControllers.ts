import { FastifyRequest, FastifyReply } from "fastify";
import { authSchema, resetPasswordSchema, validPasswordSchema } from "../schemas/authenticationSchemas";
import md5 from "md5";
import { getPrismaClient } from "../lib/prisma";
import { config } from "dotenv";
import { getSubscriptionActive } from "../utils/tenant";
import { sendEmail } from "../utils/sendEmail";

config();

export const authentication = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { email, password, tenant = 'fullnext' } = authSchema.parse(request.body);
  const prisma = getPrismaClient(tenant);
  try {

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });


    if (!user) {
      return reply.status(401).send({
        message:
          "Incorrect username or password. Please check your credentials and try again.",
      });
    }

    if (md5(password) !== user.passwordHash) {
      return reply.status(401).send({
        message:
          "Incorrect username or password. Please check your credentials and try again.",
      });
    }

    const subscriptionActive = await getSubscriptionActive(tenant)


    const token = request.server.jwt.sign(
      { ...user, subscriptionActive },
      {
        sub: user.id.toString(),
        expiresIn: "1d",
      }
    );

    reply.send({
      token,
    });
  } catch (error) {
    reply.status(500).send({
      message: "Internal server error",
    });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const resetPassword = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, tenant } = resetPasswordSchema.parse(request.body);
    const prisma = getPrismaClient(tenant);


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
      })

      await prisma.passwordReset.create({
        data: {
          email,
          codigo: `${code}`,
          expiresAt: new Date()
        }
      })


    } else {
      await prisma.passwordReset.create({
        data: {
          email,
          codigo: `${code}`,
          expiresAt: new Date()
        }
      })
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
    sendEmail(email, subject, html)
    return reply.status(200).send({ message: "E-mail enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return reply.status(500).send({ message: "Erro interno do servidor", error });
  }
};

export const verifyPasswordResetCode = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, tenant, codigo } = validPasswordSchema.parse(request.body);
    const prisma = getPrismaClient(tenant);

    console.log(email, tenant, codigo)

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return reply.status(404).send({
        message: "Email not found. Please check and try again.",
      });
    }

    // Retrieve the password reset code
    const passwordReset = await prisma.passwordReset.findFirst({
      where: { email },
    });

    if (!passwordReset) {
      return reply.status(400).send({ message: "No reset code found for this email." });
    }

    // Validate the provided code
    if (codigo !== passwordReset.codigo) {
      return reply.status(400).send({ message: "Invalid code. Please try again." });
    }

    if (passwordReset.expiresAt) {
      const now = new Date();
      const expirationDate = new Date(passwordReset.expiresAt);

      // Ignorar a hora e comparar apenas a data
      const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const expirationDateOnly = new Date(expirationDate.getFullYear(), expirationDate.getMonth(), expirationDate.getDate());

      if (expirationDateOnly < nowDate) {
        return reply.status(400).send({ message: "Code has expired. Please request a new one." });
      }
    }

    return reply.status(200).send({ message: "Valid code", codigo });

  } catch (error) {
    console.error("Error validating the recovery code:", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
};

export const updatePassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, tenant = 'fullnext', password } = authSchema.parse(request.body);
    const prisma = getPrismaClient(tenant);

    const passwordHash = md5(password);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(404).send({ message: "Email not found. Please check and try again." });
    }

    // Retrieve the password reset code
    const passwordResetRecord = await prisma.passwordReset.findFirst({ where: { email } });

    if (!passwordResetRecord) {
      return reply.status(400).send({ message: "No reset code found for this email." });
    }

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { passwordHash: passwordHash }, // Ensure the correct field name is used
    });

    // Optional: Remove the reset code after use
    await prisma.passwordReset.deleteMany({ where: { email } });

    return reply.status(200).send({ message: "Password successfully updated." });

  } catch (error: any) {
    console.error("Error resetting the password:", error);
    return reply.status(500).send({ message: "Internal server error", error: error.message });
  }
};