import { FastifyInstance } from "fastify";
import { getAllReportUsage } from "../controllers/reportUsageControllers";

export async function reportUsageRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request: any) => {
      await request.jwtVerify();
    });
    app.get("/report/usage", getAllReportUsage)
}