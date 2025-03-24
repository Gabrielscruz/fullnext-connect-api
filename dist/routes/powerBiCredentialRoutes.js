"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.powerBiCredentialRoutes = powerBiCredentialRoutes;
const powerBiCredentialControllers_1 = require("../controllers/powerBiCredentialControllers");
async function powerBiCredentialRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get("/powerbi/credential", powerBiCredentialControllers_1.getAllPowerBiCredential);
    app.get("/powerbi/all/credential", powerBiCredentialControllers_1.getPowerBiCredential);
    app.get("/powerbi/credential/:powerBiCredentialId", powerBiCredentialControllers_1.getPowerBiCredentialById);
    app.post("/powerbi/credential", powerBiCredentialControllers_1.createPowerBiCredential);
    app.put("/powerbi/credential/:powerBiCredentialId", powerBiCredentialControllers_1.updatePowerBiCredential);
}
//# sourceMappingURL=powerBiCredentialRoutes.js.map