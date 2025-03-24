"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportEmbedRoutes = reportEmbedRoutes;
const reportEmbedControllers_1 = require("../controllers/reportEmbedControllers");
async function reportEmbedRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get("/report/:reportId", reportEmbedControllers_1.getReportById);
    app.get("/report/tableau/:reportId", reportEmbedControllers_1.getTableauReportById);
    app.post("/report/showcase/:powerBiCredentialId", reportEmbedControllers_1.getReportShowcaseById);
}
//# sourceMappingURL=reportEmbedRoutes.js.map