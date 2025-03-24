"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationRoutes = organizationRoutes;
const organizationControllers_1 = require("../controllers/organizationControllers");
async function organizationRoutes(app) {
    app.post("/organization", organizationControllers_1.organization);
    app.put("/organization/upload", organizationControllers_1.uploadOrganizacao);
    app.get("/organization/:name", organizationControllers_1.getOrganizacao);
    app.get("/organization", organizationControllers_1.getAllOrganization);
}
//# sourceMappingURL=organizationRoutes.js.map