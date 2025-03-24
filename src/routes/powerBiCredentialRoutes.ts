import { FastifyInstance } from "fastify";
import { createPowerBiCredential, getAllPowerBiCredential, getPowerBiCredential, getPowerBiCredentialById, updatePowerBiCredential } from "../controllers/powerBiCredentialControllers";

export async function powerBiCredentialRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request: any) => {
      await request.jwtVerify();
    });

    app.get("/powerbi/credential", getAllPowerBiCredential);
    app.get("/powerbi/all/credential", getPowerBiCredential);
    app.get("/powerbi/credential/:powerBiCredentialId", getPowerBiCredentialById);
    app.post("/powerbi/credential", createPowerBiCredential);
    app.put("/powerbi/credential/:powerBiCredentialId", updatePowerBiCredential);
    
}