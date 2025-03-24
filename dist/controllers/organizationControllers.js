"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrganization = exports.getOrganizacao = exports.uploadOrganizacao = exports.organization = void 0;
const child_process_1 = require("child_process");
const pg_1 = require("pg");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const path_1 = require("path");
const organizationSchema_1 = require("../schemas/organizationSchema");
const prisma_1 = require("../lib/prisma");
const dotenv_1 = require("dotenv");
const newOrganization_1 = require("../utils/newOrganization");
(0, dotenv_1.config)();
const prisma = (0, prisma_1.getPrismaClient)('fullnext_management');
const pump = (0, node_util_1.promisify)(node_stream_1.pipeline);
const organization = async (request, reply) => {
    const { channels, industries, user, name } = organizationSchema_1.organizationSchema.parse(request.body);
    const DATABASE_URL = process.env.DATABASE_URL;
    try {
        const organizationExists = await prisma.organization.findFirst({
            where: { name }
        });
        if (organizationExists) {
            return reply.status(400).send({ message: 'This organization already exists' });
        }
        const organization = await prisma.organization.create({
            data: {
                name,
                ownerName: user.name,
                channels,
                industries,
                ownerEmail: user.email,
                isActive: true,
                trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        const connectionString = DATABASE_URL?.replace("<dbname>", 'postgres');
        const pgClient = new pg_1.Client({
            connectionString,
        });
        await pgClient.connect();
        await pgClient.query(`CREATE DATABASE "${name}";`);
        await pgClient.end();
        const newDatabaseUrl = DATABASE_URL?.replace("<dbname>", name);
        process.env.DATABASE_URL = newDatabaseUrl;
        console.log('DATABASE_URL', process.env.DATABASE_URL);
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)("npx prisma generate", (error, stdout, stderr) => {
                if (error) {
                    console.error(stderr);
                    return reject(error);
                }
                console.log(stdout);
                resolve(stdout);
            });
        });
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`npx prisma migrate dev --name init`, (error, stdout, stderr) => {
                if (error) {
                    console.error(stderr);
                    return reject(error);
                }
                resolve(stdout);
            });
        });
        console.log("Criando organização no banco de dados");
        await (0, newOrganization_1.newOrganization)(name, user);
        const pgClientNew = new pg_1.Client({
            connectionString: DATABASE_URL?.replace("<dbname>", name)
        });
        await pgClientNew.connect();
        try {
            await pgClientNew.query('BEGIN');
            const { rows: tables } = await pgClientNew.query(`
                SELECT 
                    c.table_name, 
                    c.column_name 
                FROM 
                    information_schema.columns c
                WHERE 
                    c.table_schema = 'public' 
                    AND c.column_default LIKE 'nextval%'
            `);
            for await (const table of tables) {
                if (!['_prisma_migrations', 'translate', 'Invite', 'Organization', 'OrganizationStyle', 'Payment'].includes(table.table_name)) {
                    console.log(`Ajustando sequência para tabela: ${table.table_name}`);
                    await pgClientNew.query(`
                        SELECT setval(
                            pg_get_serial_sequence('"${table.table_name}"', '${table.column_name}'),
                            COALESCE((SELECT MAX("${table.column_name}") FROM "${table.table_name}") + 1, 1),
                            false
                        )
                    `);
                }
            }
            await pgClientNew.query('COMMIT');
            console.log("Sequências ajustadas com sucesso.");
        }
        catch (error) {
            await pgClientNew.query('ROLLBACK');
            console.error("Erro ao ajustar sequências:", error);
        }
        finally {
            await pgClientNew.end();
        }
        process.env.DATABASE_URL = DATABASE_URL;
        return reply.send({ message: "Organization created successfully", organization });
    }
    catch (error) {
        console.log(error);
        return reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.organization = organization;
const uploadOrganizacao = async (request, reply) => {
    try {
        const { name, color } = organizationSchema_1.organizationStyleSchema.parse(request.query);
        const upload = await request.file({
            limits: { fileSize: 5_242_880 }
        });
        if (!upload) {
            return reply.status(400).send({ message: 'No file uploaded' });
        }
        const organization = await prisma.organization.findFirst({ where: { name } });
        if (!organization) {
            return reply.status(400).send({ message: 'Organization does not exist' });
        }
        const organizationStyle = await prisma.organizationStyle.findFirst({ where: { organizationId: organization.id } });
        const fileId = (0, crypto_1.randomUUID)();
        const extension = (0, path_1.extname)(upload.filename);
        const fileName = fileId.concat(extension);
        const writeStream = (0, fs_1.createWriteStream)((0, path_1.resolve)(__dirname, "../../uploads/", fileName));
        await pump(upload.file, writeStream);
        if (organizationStyle) {
            if (organizationStyle.logoUrl) {
                try {
                    (0, fs_1.unlinkSync)(organizationStyle?.logoUrl);
                }
                catch (err) {
                    console.error('Error deleting old logo:', err);
                }
            }
            await prisma.organizationStyle.update({
                where: { id: organizationStyle.id },
                data: {
                    logoUrl: `./uploads/${fileName}`,
                    primaryColor: `#${color}`,
                },
            });
        }
        else {
            await prisma.organizationStyle.create({
                data: {
                    organizationId: organization.id,
                    logoUrl: `./uploads/${fileName}`,
                    primaryColor: `#${color}`,
                    secondaryColor: '',
                },
            });
        }
        return reply.status(200).send({ message: 'File uploaded successfully', fileUrl: `./uploads/${fileName}` });
    }
    catch (error) {
        return reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.uploadOrganizacao = uploadOrganizacao;
const getOrganizacao = async (request, reply) => {
    const { name } = organizationSchema_1.organizationNamechema.parse(request.params);
    try {
        const organization = await prisma.organization.findFirst({ where: { name } });
        if (!organization) {
            return reply.status(400).send({
                primaryColor: '#FBA94C',
                logoUrl: undefined
            });
        }
        const organizationStyle = await prisma.organizationStyle.findFirst({ where: { organizationId: organization.id } });
        if (!organizationStyle) {
            return reply.status(400).send({
                primaryColor: '#FBA94C',
                logoUrl: undefined
            });
        }
        return reply.status(200).send(organizationStyle);
    }
    catch (error) {
        return reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.getOrganizacao = getOrganizacao;
const getAllOrganization = async (request, reply) => {
    const user = request.user;
    try {
        console.log(user);
        const organization = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return reply.status(200).send(organization);
    }
    catch (error) {
        return reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.getAllOrganization = getAllOrganization;
//# sourceMappingURL=organizationControllers.js.map