import { FastifyInstance } from "fastify";
import { authentication, resetPassword, updatePassword, verifyPasswordResetCode } from "../controllers/authenticationControllers";

export async function authenticationRoutes(app: FastifyInstance) {
  app.post("/authentication/signin", authentication);
  app.post("/reset/password", resetPassword)
  app.post("/password/verify-code", verifyPasswordResetCode)
  app.put("/update/password", updatePassword)
}