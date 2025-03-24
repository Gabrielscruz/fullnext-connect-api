import { FastifyInstance } from "fastify";
import { createLink, createUserLinkUsage, deleteLink, DeleteRecentById, findBySearchLink, getAccessControl, getAllFavorite, getAllPowerBiLinks, getAllRecentAccess, getLinkById, getMenuLinks, getModuleMenuLink, InsertOrDeleteFavoriteById, InsertRecentById, menuLinkValidation, updateLink } from "../controllers/menuLinkControllers";

export async function menuLinkRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request: any) => {
    await request.jwtVerify();
  });

  app.get("/menu/links", getMenuLinks);
  app.get("/menu/powerbi-links", getAllPowerBiLinks);


  app.post("/menu/links", createLink);
  app.put("/menu/links/:linkId", updateLink)
  app.delete("/menu/links/:linkId", deleteLink);

  app.get("/menu/link/:linkId", getLinkById)
  app.get("/menu/links/:searchTerm", findBySearchLink)

  app.get("/menu/access-control", getAccessControl);
  app.get("/menu/module", getModuleMenuLink)

  app.get("/menu/link/validation", menuLinkValidation)
  app.post("/menu/link/usage", createUserLinkUsage)

  app.get('/menu/favorite/:linkId', InsertOrDeleteFavoriteById);
  app.get('/menu/recent/:linkId', InsertRecentById);

  app.delete('/menu/recent/:linkId', DeleteRecentById);
  

  app.get('/menu/favorite', getAllFavorite);
  app.get('/menu/recent/access', getAllRecentAccess);
}