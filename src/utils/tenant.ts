import { getPrismaClient } from "../lib/prisma";

const prisma = getPrismaClient('fullnext_management');

export const getSubscriptionActive = async (tenant: string) => {
    const currentDate = new Date();

    if (!tenant) return false

    const organization = await prisma.organization.findUnique({
        where: { name: tenant },
    });


    if (!organization) return false

    if (!organization.ownerEmail) return false


    const subscription = await prisma.subscription.findFirst({
        select: {
            id: true,
            subscriptionId: true,
            amount: true,
            email: true,
            status: true,
            createdAt: true,
            expirationDate: true,
            collectionMethod: true,
        },
        where: {
            status: 'active', // Apenas assinaturas ativas
            email: organization.ownerEmail,
            expirationDate: {
                gte: currentDate, // Apenas assinaturas que não expiraram
            },
        },
        orderBy: {
            createdAt: 'desc', // Ordena da mais recente para a mais antiga
        },
    });

    if (!subscription) return false

    return true
} 