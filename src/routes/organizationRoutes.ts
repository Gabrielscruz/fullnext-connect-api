import { FastifyInstance } from "fastify";
import { getAllOrganization, getOrganizacao, organization, uploadOrganizacao } from "../controllers/organizationControllers";

export async function organizationRoutes(app: FastifyInstance) {
    app.post("/organization", organization);
    app.put("/organization/upload", uploadOrganizacao)
    app.get("/organization/:name", getOrganizacao)
    app.get("/organization", getAllOrganization)
}