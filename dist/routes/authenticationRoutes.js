"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRoutes = authenticationRoutes;
const authenticationControllers_1 = require("../controllers/authenticationControllers");
async function authenticationRoutes(app) {
    app.post("/authentication/signin", authenticationControllers_1.authentication);
    app.post("/reset/password", authenticationControllers_1.resetPassword);
    app.post("/password/verify-code", authenticationControllers_1.verifyPasswordResetCode);
    app.put("/update/password", authenticationControllers_1.updatePassword);
}
//# sourceMappingURL=authenticationRoutes.js.map