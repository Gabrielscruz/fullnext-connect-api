"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateRoutes = translateRoutes;
const translateControllers_1 = require("../controllers/translateControllers");
async function translateRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.post("/translate", translateControllers_1.getTranslate);
}
//# sourceMappingURL=translateRoutes.js.map