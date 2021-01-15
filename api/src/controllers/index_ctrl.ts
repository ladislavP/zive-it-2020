import { ElasticSearchService } from "../library/ElasticSearchService";
import {resJson} from "../helpers/utils";

export const openapiJson = async (ctx): Promise<void> => {
  ctx.koa.response.set('X-Auth-Type', 'application/json');
  resJson(ctx, ctx.api.openApiDoc);
};

export const search = async (ctx): Promise<void> => {
  const query = ctx.params.query.search_query;

  const client = ElasticSearchService.loadClient();

  const result = await client.search({
    index: ['products', 'config-katalog', 'toners'],
    body: {
      query: {
        bool: {
          should: [{
            wildcard: {
              'Nazov': {
                value: query + "*"
              }
            }
          }]
        }
      }
    }
  });

  resJson(ctx, result);
};