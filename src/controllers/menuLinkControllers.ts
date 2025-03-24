import { FastifyReply, FastifyRequest } from "fastify";
import { linkByIdSchema, linkBySearchSchema, menuLinkSchema, userLinkUsageSchema } from "../schemas/menuLinkSchema";
import { countPage, pagination } from "../utils/pagination";


export const getMenuLinks = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
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
            moduleId: 'asc', // Ordenação normal antes do ajuste
          },
          include: {
            AccessControlLink: true,
            FavoriteLink: true,
            RecentAccess: true
          },
        },
      },
    });

    // Filtrar módulos que possuem MenuLink
    const filteredModules = modulesWithAccess.filter(module => module.MenuLink.length > 0);

    // Ordenar e colocar "Config" por último
    const sortedModules = filteredModules.sort((a, b) => {
      if (a.title === 'Config') return 1;  // "Config" vai para o final
      if (b.title === 'Config') return -1; // "Config" vai para o final
      return a.id - b.id; // Mantém a ordenação por moduleId
    });

    reply.send(sortedModules);

  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect();
  }
};


export const getAccessControl = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const accessControl = await request.prisma.accessControl.findMany();
    reply.send(accessControl);
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}

export const getAllPowerBiLinks = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { limit, offset, ids } = pagination(request);
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
      totalPages: countPage(totalLinks, limit),
      links
    });
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const createLink = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { label, href, defaultIcon, activeIcon, selectedModule, selectedCredential, selectedType } = menuLinkSchema.parse(request.body);

  try {
    // Verifica se o link já existe
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
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
};


export const updateLink = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { linkId } = linkByIdSchema.parse(request.params);
  const { label, href, defaultIcon, activeIcon, selectedModule, selectedCredential, selectedType } = menuLinkSchema.parse(request.body)
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
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}

export const deleteLink = async (request: FastifyRequest, reply: FastifyReply) => {
  const { linkId } = linkByIdSchema.parse(request.params);
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

    // Agora, exclua o MenuLink
    const menuLink = await request.prisma.menuLink.delete({
      where: {
        id: Number(linkId)
      }
    });

    reply.send({ menuLink });
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}

export const getLinkById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { linkId } = linkByIdSchema.parse(request.params);

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
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
}

export const findBySearchLink = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { user } = request;
    const { searchTerm } = linkBySearchSchema.parse(request.params);

    const menuLinkWithAccess = await request.prisma.menuLink.findMany({
      where: {
        label: {
          contains: searchTerm,
          mode: 'insensitive', // Realiza busca ilike
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
  } catch (error: any) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const getModuleMenuLink = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const module = await request.prisma.module.findMany();
    reply.send(module);
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  } finally {
    await request.prisma.$disconnect()
  }

}

export const menuLinkValidation = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { path } = request.query as { path: string };
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
        return path.includes(String(menuLink.id))
      }
      if (menuLink.type === 3) {
        return path.includes(String(menuLink.id))
      }
      return path.includes(menuLink.href)
    }
    );

    reply.send({
      permission: Boolean(matchingLink),
      menuLinkId: matchingLink?.id || null,
    });
  } catch (error: any) {
    reply.status(500).send({
      message: 'Internal server error during menu link validation',
      error: error.message || error,
    });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const createUserLinkUsage = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { user } = request;
  const { menuLinkId, duration } = userLinkUsageSchema.parse(request.body)
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
  } catch (error) {
    reply.status(500).send({ message: 'Internal server error', error });
  }
  finally {
    await request.prisma.$disconnect()
  }
}

export const InsertRecentById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { linkId } = linkByIdSchema.parse(request.params);
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

  } catch (error) {
    console.error("Error:", error);
    reply.status(400).send({ message: "Invalid request", error });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const DeleteRecentById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { linkId } = linkByIdSchema.parse(request.params);
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
      })
    }

  } catch (error) {
    console.error("Error:", error);
    reply.status(400).send({ message: "Invalid request", error });
  } finally {
    await request.prisma.$disconnect()
  }
};


export const InsertOrDeleteFavoriteById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { linkId } = linkByIdSchema.parse(request.params);
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
    } else {
      await request.prisma.favoriteLink.delete({
        where: {
          id: favoriteLink.id, // Use o ID único aqui
        },
      });
    }

    reply.send({ favoriteLink: !favoriteLink });

  } catch (error) {
    console.error("Error:", error);
    reply.status(400).send({ message: "Invalid request", error });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const getAllFavorite = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
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
  } catch (error) {
    reply.status(400).send({ message: "Invalid request", error });
  } finally {
    await request.prisma.$disconnect()
  }
}


export const getAllRecentAccess = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const { limit, offset } = pagination(request);
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
        id: 'desc' // Ordena pela data de criação de forma decrescente
      }
    });

    reply.send({
      totalPages: countPage(totalrecentAccess, limit),
      recentAccess
    });
  } catch (error) {
    reply.status(400).send({ message: "Invalid request", error });
  } finally {
    await request.prisma.$disconnect()
  }
};