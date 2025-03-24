import { FastifyReply, FastifyRequest } from "fastify";
import { userByIdSchema, userCreateSchema, userProfileSchema, userUpdateSchema } from "../schemas/userSchemas";

import { createWriteStream } from "fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { extname, resolve } from "path";
import { randomUUID } from "crypto";
import md5 from "md5";
import { countPage, pagination } from "../utils/pagination";

const pump = promisify(pipeline)

export const getUserById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { userId } = userByIdSchema.parse(request.params);

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
  } catch (error) {
    reply.status(400).send({ message: 'Invalid request', error });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { limit, offset, ids = [] } = pagination(request);
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
      totalPages: countPage(totalUsers, limit),
      users
    });
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, accessControl, dateOfBirth, password, about } = userCreateSchema.parse(request.body)
  try {
    const passwordHash = md5(password)
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
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = userByIdSchema.parse(request.params);
  const { name, email, accessControl, dateOfBirth, password, about, updatePassword } = userUpdateSchema.parse(request.body)
  try {

    if (updatePassword) {
      const passwordHash = password ? md5(password) : undefined;
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

    } else {
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
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}

export const uploadUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = userByIdSchema.parse(request.params);
  try {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5 MB
      },
    });

    if (!upload) {
      return reply.status(400).send({ message: 'No file uploaded' });
    }

    const fileId = randomUUID();
    const extension = extname(upload.filename);
    const fileName = fileId.concat(extension);
    const filePath = resolve(__dirname, "../../uploads/", fileName);

    const writeStream = createWriteStream(filePath);

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

  } catch (error: any) {
    reply.status(500).send({ message: 'Internal server error', error: error.message });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = userByIdSchema.parse(request.params);
  try {
    const user = await request.prisma.user.delete({
      where: {
        id: Number(userId)
      }
    });
    reply.send({ user });
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}

export const  getUserProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user
  try {

    const userData = await request.prisma.user.findFirst({
      where: {
        id: Number(user.id)
      }
    });

    reply.send({ user: userData });
  }  catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}
 export const userProfile = async (request: FastifyRequest, reply: FastifyReply) => {
   const { name, isUpdatePassword, password, about } = userProfileSchema.parse(request.body)
   try {


    if (isUpdatePassword) {
      const passwordHash = md5(password);
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
   } catch (error) {
     reply.status(500).send({ message: 'Internal server error', error });
   } finally {
     await request.prisma.$disconnect()
  }
}
