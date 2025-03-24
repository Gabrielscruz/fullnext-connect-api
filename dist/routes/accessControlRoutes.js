"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessControlRoutes = accessControlRoutes;
const accessControlControllers_1 = require("../controllers/accessControlControllers");
async function accessControlRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get('/accesscontrol', accessControlControllers_1.getAllAccessControl);
    app.post('/accesscontrol', accessControlControllers_1.createAccessControl);
    app.get("/accesscontrol/:accessControlId", accessControlControllers_1.getAccessControlById);
    app.put("/accesscontrol/:accessControlId", accessControlControllers_1.updateAccessControl);
    app.delete("/accesscontrol/:accessControlId", accessControlControllers_1.deleteAccessControl);
    app.get('/access/control/links', accessControlControllers_1.getAllLinks);
}
//# sourceMappingURL=accessControlRoutes.js.map