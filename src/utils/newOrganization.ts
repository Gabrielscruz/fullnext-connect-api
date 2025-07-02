import { getPrismaClient } from "../lib/prisma";
import md5 from "md5";
import { sendEmail } from "./sendEmail";

export const newOrganization = async (tenant: string, user: any) => {
    const prisma = getPrismaClient(tenant);
    try {
        const passwordHash = md5(user.password)
        await prisma.$transaction(async (tx) => {
            await tx.module.createMany({
                data: [
                    { id: 1, title: "Config", defaultIcon: "PiGear", activeIcon: "PiGearFill" },
                    { id: 2, title: "Analyst", defaultIcon: "PiChartLineUp", activeIcon: "PiChartLineUpFill" },
                ],
            });



            await tx.accessControl.createMany({
                data: [
                    { name: 'Admin' },
                    { name: 'User' },
                ],
            });

            await tx.user.create({
                data: {
                    id: 1,
                    name: user.name,
                    email: user.email,
                    profileUrl: user?.image || null,
                    passwordHash,
                    dateOfBirth: new Date(),
                    admin: true,
                    firstAccess: true,
                    about: '',
                    accessControlId: 1
                },
            });

            await tx.menuLinkType.createMany({
                data: [
                    { name: "Default" },
                    { name: "Powerbi" },
                    { name: "Tableau" },
                ],
            });

            await tx.powerBiCredential.createMany({
                data: [
                    {
                        id: 1,
                        name: "Default",
                        clientId: "client_id_here",
                        clientSecret: "client_secret_here",
                        tenantId: "tenant_id_here",
                        createdAtUserId: 1,
                    },
                    {
                        id: 2,
                        name: "Power BI Credentials",
                        clientId: "b06750b5-2870-4ad6-a752-31f5bb93a05e",
                        clientSecret: "e248ddf2-e2ea-4762-b139-c2a97eff7e7a",
                        tenantId: "ea76e4ac-fa19-4319-abf0-a9b60980dc4b",
                        createdAtUserId: 1,
                    },
                    {
                        id: 3,
                        name: "Tableau",
                        clientId: "00559767",
                        clientSecret: "WQ48Q",
                        tenantId: "8e3491d7",
                        createdAtUserId: 1,
                    },
                ],
            });


            await tx.menuLink.createMany({
                data: [
                    {
                        id: 0,
                        label: 'Payment',
                        href: '/payment',
                        defaultIcon: 'PiMoney',
                        activeIcon: 'PiMoneyFill',
                        order: 1,
                        moduleId: 1,
                        type: 1,
                        powerBiCredentialId: 1
                    },
                    {
                        id: 1,
                        label: 'Users',
                        href: '/user',
                        defaultIcon: 'PiUser',
                        activeIcon: 'PiUserFill',
                        order: 1,
                        moduleId: 1,
                        type: 1,
                        powerBiCredentialId: 1
                    },
                    {
                        id: 2,
                        label: 'Credential',
                        href: '/credential',
                        defaultIcon: 'PiKey',
                        activeIcon: 'PiKeyFill',
                        order: 2,
                        moduleId: 1,
                        type: 1,
                        powerBiCredentialId: 1
                    },
                    {
                        id: 3,
                        label: 'Access Control',
                        href: '/accesscontrol',
                        defaultIcon: 'PiLock',
                        activeIcon: 'PiLockFill',
                        order: 3,
                        moduleId: 1,
                        type: 1,
                        powerBiCredentialId: 1
                    },
                    {
                        id: 4,
                        label: 'Link',
                        href: '/link',
                        defaultIcon: 'PiPresentationChart',
                        activeIcon: 'PiPresentationChartFill',
                        order: 4,
                        moduleId: 1,
                        type: 1,
                        powerBiCredentialId: 1
                    },
                    {
                        id: 5,
                        label: 'Module',
                        href: '/module',
                        defaultIcon: 'PiGridFour',
                        activeIcon: 'PiGridFourFill',
                        order: 5,
                        moduleId: 1,
                        type: 1,
                        powerBiCredentialId: 1
                    },
                    {
                        id: 6,
                        label: 'Report link Usage',
                        href: '/linkusage',
                        defaultIcon: 'PiTreeView',
                        activeIcon: 'PiTreeViewFill',
                        order: 6,
                        moduleId: 1,
                        type: 1,
                        powerBiCredentialId: 1
                    },
                    {
                        id: 7,
                        label: 'Corporate spend',
                        href: 'https://app.powerbi.com/groups/0c3dc1b8-48ca-4806-8b21-48452b8e795c/reports/b5d97ba7-7316-428d-83d2-9178788d47e3/ReportSection2?experience=power-bi',
                        defaultIcon: 'PiBuildingApartment',
                        activeIcon: 'PiBuildingApartmentFill',
                        order: 1,
                        moduleId: 2,
                        type: 2,
                        powerBiCredentialId: 2
                    },
                    {
                        id: 8,
                        label: 'Sales and Marketing',
                        href: 'https://app.powerbi.com/groups/0c3dc1b8-48ca-4806-8b21-48452b8e795c/reports/56b1e2c2-7810-4f1e-8e77-1bccd7f88730/ReportSection2?experience=power-bi',
                        defaultIcon: 'PiIntersect',
                        activeIcon: 'PiIntersectFill',
                        order: 2,
                        moduleId: 2,
                        type: 2,
                        powerBiCredentialId: 2
                    },
                    {
                        id: 9,
                        label: 'Customer Profitability',
                        href: 'https://app.powerbi.com/groups/0c3dc1b8-48ca-4806-8b21-48452b8e795c/reports/3e598b13-91a6-4db3-a222-9e18c14b1cd4/ReportSection3?experience=power-bi',
                        defaultIcon: 'PiHeartBreak',
                        activeIcon: 'PiHeartBreakFill',
                        order: 3,
                        moduleId: 2,
                        type: 2,
                        powerBiCredentialId: 2
                    },
                    {
                        id: 10,
                        label: 'Supplier Quality Analysis',
                        href: 'https://app.powerbi.com/groups/0c3dc1b8-48ca-4806-8b21-48452b8e795c/reports/9cd03a25-596d-46fd-8453-2bedb9750369/ReportSection2?experience=power-bi',
                        defaultIcon: 'PiClipboardText',
                        activeIcon: 'PiClipboardTextFill',
                        order: 4,
                        moduleId: 2,
                        type: 2,
                        powerBiCredentialId: 2
                    }
                ],
            });

            await tx.accessControlLink.createMany({
                data: [
                    { id: 0, accessControlId: 1, menuLinkId: 0 },
                    { id: 1, accessControlId: 1, menuLinkId: 1 },
                    { id: 2, accessControlId: 1, menuLinkId: 2 },
                    { id: 3, accessControlId: 1, menuLinkId: 3 },
                    { id: 4, accessControlId: 1, menuLinkId: 4 },
                    { id: 5, accessControlId: 1, menuLinkId: 5 },
                    { id: 6, accessControlId: 1, menuLinkId: 6 },
                    { id: 7, accessControlId: 1, menuLinkId: 7 },
                    { id: 8, accessControlId: 1, menuLinkId: 8 },
                    { id: 9, accessControlId: 1, menuLinkId: 9 },
                    { id: 10, accessControlId: 1, menuLinkId: 10 }
                ],
            });

            await tx.filter.createMany({
                data: [
                    { id: 1, menuLinkId: 1, instruction: `SELECT jsonb_build_object('columnName', '"User".id', 'headerName', 'Id user', 'type', 1, 'options', array_agg(DISTINCT "User".id)) AS ids, jsonb_build_object('columnName', '"User".name', 'headerName', 'Name', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "User".name, 'label',"User".name))) AS names, jsonb_build_object('columnName', '"User".email', 'headerName', 'Email', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "User".email, 'label',"User".email))) AS emails, jsonb_build_object('columnName', '"User"."dateOfBirth"', 'headerName', 'Date Of Birth', 'type', 2, 'options', array_agg(DISTINCT jsonb_build_object('value', "User"."dateOfBirth"::date, 'label', "User"."dateOfBirth"::date))) AS "dateOfBirths", jsonb_build_object('columnName', '"User"."createdAt"', 'headerName', 'created At', 'type', 2, 'options', array_agg(DISTINCT jsonb_build_object('value', "User"."createdAt"::date, 'label', "User"."createdAt"::date))) AS "createdAts", jsonb_build_object('columnName', '"AccessControl".id', 'headerName', 'Access Control', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "AccessControl".id, 'label',"AccessControl"."name"))) AS accesscontrols FROM public."User" INNER JOIN public."AccessControl" on "AccessControl".id = "User"."accessControlId"` },
                    { id: 2, menuLinkId: 2, instruction: `SELECT jsonb_build_object('columnName', '"PowerBiCredential".id', 'headerName', 'Id Credential', 'type', 1, 'options', array_agg(DISTINCT "PowerBiCredential".id)) AS ids, jsonb_build_object('columnName', '"PowerBiCredential".name', 'headerName', 'Credential', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "PowerBiCredential".name, 'label',"PowerBiCredential".name))) AS credentials, jsonb_build_object('columnName', '"User".name', 'headerName', 'Name', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "User".name, 'label',"User".name))) AS names, jsonb_build_object('columnName', '"PowerBiCredential"."createdAt"', 'headerName', 'created At', 'type', 2, 'options', array_agg(DISTINCT jsonb_build_object('value', "PowerBiCredential"."createdAt"::date, 'label', "PowerBiCredential"."createdAt"::date))) AS "createdAts" FROM public."PowerBiCredential" INNER JOIN public."User" ON "PowerBiCredential"."createdAtUserId" = "User".id` },
                    { id: 3, menuLinkId: 3, instruction: `SELECT jsonb_build_object('columnName', '"AccessControl".id', 'headerName', 'Id Access Control', 'type', 1, 'options', array_agg(DISTINCT "AccessControl".id)) AS ids, jsonb_build_object('columnName', '"AccessControl".name', 'headerName', 'Access Control', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "AccessControl".name, 'label',"AccessControl".name))) AS credentials FROM public."AccessControl"` },
                    { id: 4, menuLinkId: 4, instruction: `SELECT jsonb_build_object('columnName', '"MenuLink".id', 'headerName', 'Id Menu Link', 'type', 1, 'options', array_agg(DISTINCT "MenuLink".id)) AS ids, jsonb_build_object('columnName', '"MenuLink".id', 'headerName', 'MenuLink', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "MenuLink".id, 'label',"MenuLink".label))) AS names, jsonb_build_object('columnName', '"MenuLinkType".id', 'headerName', 'Type', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "MenuLinkType".id, 'label',"MenuLinkType".name))) AS types, jsonb_build_object('columnName', '"Module".id', 'headerName', 'Module', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "Module".id, 'label',"Module".title))) AS modules, jsonb_build_object('columnName', '"PowerBiCredential".id', 'headerName', 'Credential', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "PowerBiCredential".id, 'label',"PowerBiCredential".name))) AS credentials FROM public."MenuLink" INNER JOIN public."MenuLinkType" ON "MenuLinkType".id = "MenuLink".type INNER JOIN public."Module" ON "Module".id = "MenuLink"."moduleId" INNER JOIN public."PowerBiCredential" ON "PowerBiCredential".id = "MenuLink"."powerBiCredentialId"` },
                    { id: 5, menuLinkId: 5, instruction: `SELECT jsonb_build_object('columnName', '"Module".id', 'headerName', 'Id Module', 'type', 1, 'options', array_agg(DISTINCT "Module".id)) AS ids, jsonb_build_object('columnName', '"Module".title', 'headerName', 'Name', 'type', 1, 'options', array_agg(DISTINCT jsonb_build_object('value', "Module".title, 'label',"Module".title))) AS names FROM public."Module"` }
                ],
            });
        })


        const subject = "Bem vindo Fullnext connect";
        const html = `
            <html>
                <head>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                    }
                    .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                    text-align: center;
                    background-color: #FF7F00;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    color: #ffffff;
                    }
                    .content {
                    text-align: center;
                    padding: 20px;
                    font-size: 16px;
                    color: #333333;
                    }
                    .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #888888;
                    border-top: 1px solid #eeeeee;
                    }
                    .button {
                    display: inline-block;
                    background-color: #FF7F00;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 10px;
                    }
                    .info {
                    display: block;
                    font-weight: bold;
                    margin: 5px 0;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">
                    <h1><strong>FullNext Connect</strong></h1>
                    <h2>Olá, ${user.name}!</h2>
                    <p>Sua organização foi criada com sucesso!</p>
                    </div>
                    <div class="content">
                    <p>Os detalhes da sua organização estão abaixo:</p>
                    <p><span class="info">E-mail Master:</span> ${user.email}</p>
                    <p><span class="info">Senha Inicial:</span> ${user.password}</p>
                    <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
                    <p>
                        <a href="https://fullnext-connect.vercel.app/login" class="button">
                        Acessar plataforma
                        </a>
                    </p>
                    </div>
                    <div class="footer">
                    <p>&copy; 2025 FullNext. Todos os direitos reservados.</p>
                    </div>
                </div>
                </body>
            </html>
            `;
        sendEmail(user.email, subject, html)
        console.log("Todos os dados foram inseridos com sucesso!")
    } catch (error) {
        console.log({
            message: error,
        });
    } finally {
        await prisma.$disconnect()
    }
}
