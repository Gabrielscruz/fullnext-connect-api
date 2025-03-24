import { FastifyInstance } from "fastify";
import { createUser, deleteUser, getAllUsers, getUserById, getUserProfile, updateUser, uploadUser, userProfile } from "../controllers/usersControllers";

export async function usersRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request: any) => {
    await request.jwtVerify();
  });
  app.get("/user/:userId", getUserById);
  app.post("/user", createUser);
  app.put("/user/:userId", updateUser);
  app.delete("/user/:userId", deleteUser);

  app.put("/profile/:userId", uploadUser);
  app.get("/profile", getUserProfile);
  app.put("/profile", userProfile);

  app.put("/user/upload/:userId", uploadUser);
  app.get("/users", getAllUsers);
  

}