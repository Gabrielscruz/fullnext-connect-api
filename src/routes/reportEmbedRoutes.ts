import { FastifyInstance } from "fastify";
import { getReportById, getReportShowcaseById, getTableauReportById } from "../controllers/reportEmbedControllers";

export async function reportEmbedRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request: any) => {
        await request.jwtVerify();
    });

    app.get("/report/:reportId", getReportById)
    app.get("/report/tableau/:reportId", getTableauReportById)
    
    app.post("/report/showcase/:powerBiCredentialId", getReportShowcaseById)
}