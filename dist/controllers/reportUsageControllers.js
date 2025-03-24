"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReportUsage = void 0;
const getAllReportUsage = async (request, reply) => {
    try {
        const query = `
            SELECT 
                "UserLinkUsage"."createdAt"::date
                ,"UserLinkUsage"."userId"
                ,"User"."name"	
                ,"User"."accessControlId"
                ,"AccessControl"."name" as AccessControlName
                ,"UserLinkUsage"."menuLinkId"
                ,"MenuLink"."label"
                ,CAST(COUNT(*) AS INTEGER) AS "qtd"
                ,CAST(SUM("UserLinkUsage"."duration") AS INTEGER) AS "duration"
            FROM public."UserLinkUsage"
            INNER JOIN public."MenuLink" 
                ON "MenuLink"."id" = "UserLinkUsage"."menuLinkId"
            INNER JOIN public."User"
                ON "User"."id" = "UserLinkUsage"."userId"
            INNER JOIN public."AccessControl"
                ON "AccessControl"."id" = "User"."accessControlId"
            WHERE "MenuLink"."type" in(2,3,4)
            GROUP BY
                "UserLinkUsage"."createdAt"::date
                ,"UserLinkUsage"."userId"
                ,"User"."name"	
                ,"User"."accessControlId"
                ,"AccessControl"."name" 
                ,"UserLinkUsage"."menuLinkId"
                ,"MenuLink"."label"
            ORDER BY
                "UserLinkUsage"."createdAt"::date
        `;
        const reportUsage = await request.prisma.$queryRawUnsafe(query);
        reply.send(reportUsage);
    }
    catch (error) {
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getAllReportUsage = getAllReportUsage;
//# sourceMappingURL=reportUsageControllers.js.map