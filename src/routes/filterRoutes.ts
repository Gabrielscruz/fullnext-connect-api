import { FastifyInstance } from "fastify";
import { getFilter } from "../controllers/filterControllers";

export async function filterRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request: any) => {
      await request.jwtVerify();
    });
  
    app.post("/filter/:linkId", getFilter);
}