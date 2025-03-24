import { FastifyInstance } from "fastify";
import { createModule, deleteModule, getAllModule, getModuleById, updateModule } from "../controllers/moduleControllers";

export async function moduleRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request: any) => {
      await request.jwtVerify();
    });

    app.get("/modules", getAllModule);
    app.get("/module/:moduleId", getModuleById)

    app.post("/module", createModule)
    app.put("/module/:moduleId", updateModule)
    app.delete("/module/:moduleId", deleteModule)
}