import { FastifyReply, FastifyRequest } from "fastify";
import { reportEmbedIdSchema, reportEmbedShowCaseBodySchema, reportEmbedShowCaseCredentialIdSchema } from "../schemas/reportEmbedSchema";
import axios from "axios";

export const getReportById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { reportId } = reportEmbedIdSchema.parse(request.params);

    const menuLink = await request.prisma.menuLink.findFirst({
      include: {
        powerBiCredential: true,
        FavoriteLink: true
      },
      where: {
        id: Number(reportId),
        type: 2
      }
    })


    const regex = /groups\/([a-f0-9-]+)\/reports\/([a-f0-9-]+)/;
    const matches = menuLink?.href.match(regex);
    let group_id = null;
    let report_id = null;
    let tenant_id = null;
    let client_id = null;
    let client_secret = null;

    if (matches) {
      group_id = matches[1];
      report_id = matches[2];
    }

    if (menuLink?.powerBiCredential) {
      tenant_id = menuLink?.powerBiCredential.tenantId;
      client_id = menuLink?.powerBiCredential.clientId;
      client_secret = menuLink?.powerBiCredential.clientSecret;
    }

    if (!tenant_id || !client_id || !client_secret || !group_id) {
      return reply.status(400).send({ error: 'Dados de configuração ausentes.' });
    }

    const getAccessToken = async () => {
      const response = await axios.post(
        `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id,
          client_secret,
          grant_type: 'client_credentials',
          scope: 'https://analysis.windows.net/powerbi/api/.default',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      return response.data.access_token;
    };

    const getReport = async (access_token: string) => {
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${group_id}/reports/${report_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    };

    const generateEmbedToken = async (access_token: string, datasetId: string, reportId: string) => {
      const response = await axios.post(
        `https://api.powerbi.com/v1.0/myorg/GenerateToken`,
        {
          datasets: [{ id: datasetId, xmlaPermissions: 'ReadOnly' }],
          reports: [{ id: reportId }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );
      return response.data.token;
    };

    const access_token = await getAccessToken();
    const report = await getReport(access_token);
    const { id, embedUrl, datasetId } = report;
    const accessToken = await generateEmbedToken(access_token, datasetId, id);

    reply.send({ id, embedUrl, accessToken, label: menuLink?.label, favorite: (menuLink?.FavoriteLink?.length || 0) > 0 ? true : false });

  } catch (error) {
    reply.status(500).send({ error: 'Erro ao processar a solicitação.' });
  }
  finally {
    await request.prisma.$disconnect()
  }
};


export const getReportShowcaseById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const { powerBiCredentialId } = reportEmbedShowCaseCredentialIdSchema.parse(request.params);
  const { href } = reportEmbedShowCaseBodySchema.parse(request.body)
  try {

    const powerBiCredential = await request.prisma.powerBiCredential.findFirst({
      where: {
        id: Number(powerBiCredentialId),
      }
    })


    const regex = /groups\/([a-f0-9-]+)\/reports\/([a-f0-9-]+)/;
    const matches = href.match(regex);
    let group_id = null;
    let report_id = null;
    let tenant_id = null;
    let client_id = null;
    let client_secret = null;

    if (matches) {
      group_id = matches[1];
      report_id = matches[2];
    }

    if (powerBiCredential) {
      tenant_id = powerBiCredential.tenantId;
      client_id = powerBiCredential.clientId;
      client_secret = powerBiCredential.clientSecret;
    }

    if (!tenant_id || !client_id || !client_secret || !group_id) {
      return reply.status(400).send({ error: 'Dados de configuração ausentes.' });
    }

    const getAccessToken = async () => {
      const response = await axios.post(
        `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id,
          client_secret,
          grant_type: 'client_credentials',
          scope: 'https://analysis.windows.net/powerbi/api/.default',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      return response.data.access_token;
    };

    const getReport = async (access_token: string) => {
      const response = await axios.get(
        `https://api.powerbi.com/v1.0/myorg/groups/${group_id}/reports/${report_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    };

    const generateEmbedToken = async (access_token: string, datasetId: string, reportId: string) => {
      const response = await axios.post(
        `https://api.powerbi.com/v1.0/myorg/GenerateToken`,
        {
          datasets: [{ id: datasetId, xmlaPermissions: 'ReadOnly' }],
          reports: [{ id: reportId }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );
      return response.data.token;
    };

    const access_token = await getAccessToken();
    const report = await getReport(access_token);
    const { id, embedUrl, datasetId } = report;
    const accessToken = await generateEmbedToken(access_token, datasetId, id);

    reply.send({ id, embedUrl, accessToken });

  } catch (error) {
    reply.status(500).send({ error: 'Erro ao processar a solicitação.' });
  } finally {
    await request.prisma.$disconnect()
  }
};

export const getTableauReportById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { reportId } = reportEmbedIdSchema.parse(request.params);

    const menuLink = await request.prisma.menuLink.findFirst({
      include: {
        powerBiCredential: true,
        FavoriteLink: true
      },
      where: {
        id: Number(reportId),
        type: 3
      }
    })

    let client_id = null;
    let client_secret = null;


    if (menuLink?.powerBiCredential) {
      client_id = menuLink?.powerBiCredential.clientId;
      client_secret = menuLink?.powerBiCredential.clientSecret;
    }

    if (!client_id || !client_secret) {
      return reply.status(400).send({ error: 'Dados de configuração ausentes.' });
    }

    reply.send({ id: Number(reportId), embedUrl: menuLink?.href, accessToken: null, label: menuLink?.label, favorite: (menuLink?.FavoriteLink?.length || 0) > 0 ? true : false });

  } catch (error) {
    reply.status(500).send({ error: 'Erro ao processar a solicitação.' });
  }
  finally {
    await request.prisma.$disconnect()
  }
};

