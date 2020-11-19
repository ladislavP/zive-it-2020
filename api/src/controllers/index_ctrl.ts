import {resJson} from "../helpers/utils";

export const openapiJson = async (ctx): Promise<void> => {
  ctx.koa.response.set('X-Auth-Type', 'application/json');
  resJson(ctx, ctx.api.openApiDoc);
};

export const search = async (ctx): Promise<void> => {
  const config = require('config');
  const elasticsearchConfig = config.get('elasticsearch');

  const { Client } = require('@elastic/elasticsearch');
  const client = new Client(elasticsearchConfig);

  const result = await client.search({
    index: 'produkty_index',
    body: {
      query: {
        bool: {
          should: {
              wildcard: {
                'Nazov': {
                  value: '*laser*'
                }
              }
          }
        }
      }
    }
  });

  resJson(ctx, result);
};