import { FastifyInstance } from "fastify";
import { getTranslate } from "../controllers/translateControllers";

export async function translateRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request: any) => {
      await request.jwtVerify();
    });
  
    app.post("/translate", getTranslate);
}