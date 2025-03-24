import { FastifyInstance } from "fastify";
import { createOrUpdateSubscriptions, getAllSubscriptions, getSubscription } from "../controllers/paymentControllers";

export async function paymentRoutes(app: FastifyInstance) {
    app.post("/subscription", createOrUpdateSubscriptions);
    app.get("/subscriptions", getAllSubscriptions)
    app.get("/last/subscription", getSubscription)
}