import { FastifyInstance } from "fastify";
import { feedback, uploadfeedback } from "../controllers/feedbackControllers";


export async function feedbackRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request: any) => {
        await request.jwtVerify();
    });
    app.post("/feedbacks", feedback);
    app.post("/feedback/upload/:feedbackId", uploadfeedback)

}