"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportUsageRoutes = reportUsageRoutes;
const reportUsageControllers_1 = require("../controllers/reportUsageControllers");
async function reportUsageRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get("/report/usage", reportUsageControllers_1.getAllReportUsage);
}
//# sourceMappingURL=reportUsageRoutes.js.map