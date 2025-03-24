"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRoutes = moduleRoutes;
const moduleControllers_1 = require("../controllers/moduleControllers");
async function moduleRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get("/modules", moduleControllers_1.getAllModule);
    app.get("/module/:moduleId", moduleControllers_1.getModuleById);
    app.post("/module", moduleControllers_1.createModule);
    app.put("/module/:moduleId", moduleControllers_1.updateModule);
    app.delete("/module/:moduleId", moduleControllers_1.deleteModule);
}
//# sourceMappingURL=moduleRoutes.js.map