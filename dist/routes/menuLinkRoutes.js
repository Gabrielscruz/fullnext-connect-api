"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuLinkRoutes = menuLinkRoutes;
const menuLinkControllers_1 = require("../controllers/menuLinkControllers");
async function menuLinkRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get("/menu/links", menuLinkControllers_1.getMenuLinks);
    app.get("/menu/powerbi-links", menuLinkControllers_1.getAllPowerBiLinks);
    app.post("/menu/links", menuLinkControllers_1.createLink);
    app.put("/menu/links/:linkId", menuLinkControllers_1.updateLink);
    app.delete("/menu/links/:linkId", menuLinkControllers_1.deleteLink);
    app.get("/menu/link/:linkId", menuLinkControllers_1.getLinkById);
    app.get("/menu/links/:searchTerm", menuLinkControllers_1.findBySearchLink);
    app.get("/menu/access-control", menuLinkControllers_1.getAccessControl);
    app.get("/menu/module", menuLinkControllers_1.getModuleMenuLink);
    app.get("/menu/link/validation", menuLinkControllers_1.menuLinkValidation);
    app.post("/menu/link/usage", menuLinkControllers_1.createUserLinkUsage);
    app.get('/menu/favorite/:linkId', menuLinkControllers_1.InsertOrDeleteFavoriteById);
    app.get('/menu/recent/:linkId', menuLinkControllers_1.InsertRecentById);
    app.delete('/menu/recent/:linkId', menuLinkControllers_1.DeleteRecentById);
    app.get('/menu/favorite', menuLinkControllers_1.getAllFavorite);
    app.get('/menu/recent/access', menuLinkControllers_1.getAllRecentAccess);
}
//# sourceMappingURL=menuLinkRoutes.js.map