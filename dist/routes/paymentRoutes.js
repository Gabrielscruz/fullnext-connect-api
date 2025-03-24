"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = paymentRoutes;
const paymentControllers_1 = require("../controllers/paymentControllers");
async function paymentRoutes(app) {
    app.post("/subscription", paymentControllers_1.createOrUpdateSubscriptions);
    app.get("/subscriptions", paymentControllers_1.getAllSubscriptions);
    app.get("/last/subscription", paymentControllers_1.getSubscription);
}
//# sourceMappingURL=paymentRoutes.js.map