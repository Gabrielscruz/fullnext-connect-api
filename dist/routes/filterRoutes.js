"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRoutes = filterRoutes;
const filterControllers_1 = require("../controllers/filterControllers");
async function filterRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.post("/filter/:linkId", filterControllers_1.getFilter);
}
//# sourceMappingURL=filterRoutes.js.map