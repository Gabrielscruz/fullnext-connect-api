"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = usersRoutes;
const usersControllers_1 = require("../controllers/usersControllers");
async function usersRoutes(app) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get("/user/:userId", usersControllers_1.getUserById);
    app.post("/user", usersControllers_1.createUser);
    app.put("/user/:userId", usersControllers_1.updateUser);
    app.delete("/user/:userId", usersControllers_1.deleteUser);
    app.put("/profile/:userId", usersControllers_1.uploadUser);
    app.get("/profile", usersControllers_1.getUserProfile);
    app.put("/profile", usersControllers_1.userProfile);
    app.put("/user/upload/:userId", usersControllers_1.uploadUser);
    app.get("/users", usersControllers_1.getAllUsers);
}
//# sourceMappingURL=usersRoutes.js.map