"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscription = exports.getAllSubscriptions = exports.createOrUpdateSubscriptions = void 0;
const prisma_1 = require("../lib/prisma");
const paymentSchema_1 = require("../schemas/paymentSchema");
const prisma = (0, prisma_1.getPrismaClient)('fullnext_management');
const createOrUpdateSubscriptions = async (request, reply) => {
    const { subscriptionId, customerId, amount = 0, currency, createAction, subscription } = paymentSchema_1.SubscriptionsSchema.parse(request.body);
    try {
        const result = await prisma.$transaction(async (prisma) => {
            let customer = await prisma.customer.findUnique({
                where: { customerId },
            });
            if (!customer) {
                customer = await prisma.customer.create({
                    data: {
                        customerId,
                        email: subscription.email,
                    },
                });
            }
            const organization = await prisma.organization.findUnique({
                where: { ownerEmail: subscription.email },
            });
            if (!organization) {
                throw new Error('Organization not found for the provided email.');
            }
            if (createAction) {
                const currentDate = new Date();
                const expirationDate = new Date(currentDate);
                expirationDate.setDate(currentDate.getDate() + 30);
                const newSubscription = await prisma.subscription.create({
                    data: {
                        subscriptionId,
                        customerId: customer.customerId,
                        email: subscription.email,
                        status: subscription.status,
                        expirationDate,
                        priceId: subscription.price_id,
                        amount,
                        currency,
                        collectionMethod: subscription.collection_method
                    },
                });
                const newPayment = await prisma.payment.create({
                    data: {
                        organizationId: organization.id,
                        amount,
                        currency,
                        paymentDate: new Date(),
                        status: 'completed',
                        subscriptionId: newSubscription.subscriptionId,
                        customerId: customer.customerId,
                    },
                });
                return { newSubscription, newPayment };
            }
            const newSubscription = await prisma.subscription.update({
                where: { subscriptionId },
                data: {
                    customerId: customer.customerId,
                    email: subscription.email,
                    status: subscription.status,
                    priceId: subscription.price_id,
                    collectionMethod: subscription.collection_method,
                    currency,
                },
            });
            const existingPayment = await prisma.payment.findFirst({
                where: { subscriptionId, customerId: customer.customerId },
            });
            let newPayment = null;
            if (existingPayment) {
                newPayment = await prisma.payment.update({
                    where: { id: existingPayment.id },
                    data: {
                        organizationId: organization.id,
                        currency,
                        paymentDate: new Date(),
                        status: subscription.status,
                        subscriptionId: newSubscription.subscriptionId,
                        customerId: customer.customerId,
                    },
                });
            }
            return { newSubscription, newPayment };
        });
        return reply.status(201).send({
            subscriptionId: result.newSubscription.subscriptionId,
            customerId: result.newSubscription.customerId,
            newPayment: result.newPayment,
        });
    }
    catch (error) {
        return reply.status(500).send({
            message: 'Internal server error.',
            error: error?.message || error,
        });
    }
};
exports.createOrUpdateSubscriptions = createOrUpdateSubscriptions;
const getAllSubscriptions = async (request, reply) => {
    try {
        const { tenant } = paymentSchema_1.tenantSchema.parse(request.query);
        if (!tenant) {
            return reply.status(400).send({ message: 'Tenant é obrigatório.' });
        }
        const organization = await prisma.organization.findUnique({
            where: { name: tenant },
        });
        if (!organization) {
            return reply.status(404).send({ message: 'Organização não encontrada para o tenant fornecido.' });
        }
        if (!organization.ownerEmail) {
            return reply.status(404).send({ message: 'O proprietário da organização não possui um e-mail cadastrado.' });
        }
        const subscriptions = await prisma.subscription.findMany({
            select: {
                id: true,
                amount: true,
                email: true,
                status: true,
                createdAt: true,
                expirationDate: true,
            },
            where: { email: organization.ownerEmail },
            orderBy: { id: 'desc' },
            take: 30,
        });
        return reply.send({ subscriptions });
    }
    catch (error) {
        console.error('Erro ao buscar assinaturas:', error);
        return reply.status(500).send({ message: 'Erro interno do servidor', error: error.message });
    }
};
exports.getAllSubscriptions = getAllSubscriptions;
const getSubscription = async (request, reply) => {
    try {
        const { tenant } = paymentSchema_1.tenantSchema.parse(request.query);
        const currentDate = new Date();
        if (!tenant) {
            return reply.status(400).send({ message: 'Tenant é obrigatório.' });
        }
        const organization = await prisma.organization.findUnique({
            where: { name: tenant },
        });
        if (!organization) {
            return reply.status(404).send({ message: 'Organização não encontrada para o tenant fornecido.' });
        }
        if (!organization.ownerEmail) {
            return reply.status(404).send({ message: 'O proprietário da organização não possui um e-mail cadastrado.' });
        }
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
        if (!subscription) {
            return reply.status(404).send({ message: 'Nenhuma assinatura ativa encontrada.' });
        }
        reply.send({ subscription });
    }
    catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        reply.status(500).send({ message: 'Erro interno do servidor', error: error.message });
    }
};
exports.getSubscription = getSubscription;
//# sourceMappingURL=paymentControllers.js.map