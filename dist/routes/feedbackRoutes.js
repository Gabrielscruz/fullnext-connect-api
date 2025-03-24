"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRoutes = feedbackRoutes;
const feedbackControllers_1 = require("../controllers/feedbackControllers");
async function feedbackRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.post("/feedbacks", feedbackControllers_1.feedback);
    app.post("/feedback/upload/:feedbackId", feedbackControllers_1.uploadfeedback);
}
//# sourceMappingURL=feedbackRoutes.js.map