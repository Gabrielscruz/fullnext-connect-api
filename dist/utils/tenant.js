"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionActive = void 0;
const prisma_1 = require("../lib/prisma");
const prisma = (0, prisma_1.getPrismaClient)('fullnext_management');
const getSubscriptionActive = async (tenant) => {
    const currentDate = new Date();
    if (!tenant)
        return false;
    const organization = await prisma.organization.findUnique({
        where: { name: tenant },
    });
    if (!organization)
        return false;
    if (!organization.ownerEmail)
        return false;
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
            status: 'active',
            email: organization.ownerEmail,
            expirationDate: {
                gte: currentDate,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!subscription)
        return false;
    return true;
};
exports.getSubscriptionActive = getSubscriptionActive;
//# sourceMappingURL=tenant.js.map