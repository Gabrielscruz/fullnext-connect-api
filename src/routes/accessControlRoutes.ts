import { FastifyInstance } from "fastify";
import { createAccessControl, deleteAccessControl, getAccessControlById, getAllAccessControl, getAllLinks, updateAccessControl } from "../controllers/accessControlControllers";

export async function accessControlRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request: any) => {
    await request.jwtVerify();
  });

  app.get('/accesscontrol', getAllAccessControl);
  app.post('/accesscontrol', createAccessControl);
  app.get("/accesscontrol/:accessControlId", getAccessControlById);
  app.put("/accesscontrol/:accessControlId", updateAccessControl);
  app.delete("/accesscontrol/:accessControlId", deleteAccessControl);
  app.get('/access/control/links', getAllLinks)

}