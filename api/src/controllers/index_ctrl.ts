import {resJson} from "../helpers/utils";

export const openapiJson = async (ctx): Promise<void> => {
  ctx.koa.response.set('X-Auth-Type', 'application/json');
  resJson(ctx, ctx.api.openApiDoc);
};

export const search = async (ctx): Promise<void> => {
  const config = require('config');
  const elasticsearchConfig = config.get('elasticsearch');
  const query = ctx.params.query.search_query;

  const { Client } = require('@elastic/elasticsearch');
  const client = new Client(elasticsearchConfig);

  const result = await client.search({
    index: 'products',
    body: {
      query: {
        bool: {
          should: {
              wildcard: {
                'Nazov': {
                  value: query + "*"
                }
              }
          }
        }
      }
    }
  });

  const fs = require('fs');
  const fileContents = fs.readFileSync('config/config-katalog.xml');
  const xml2js = require('xml2js');

  var parser = new xml2js.Parser();
  parser.parseString(fileContents, (err, result) => {
    // result['config']['default']['0']['application-menu']['0']
  });

  resJson(ctx, result);
};