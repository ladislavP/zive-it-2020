import {resJson} from "../helpers/utils";

export const test = async (ctx): Promise<void> => {
  resJson(ctx, {});
};

export const openapiJson = async (ctx): Promise<void> => {
  ctx.koa.response.set('X-Auth-Type', 'application/json');
  resJson(ctx, ctx.api.openApiDoc);
};

export const test2 = async (ctx): Promise<void> => {

  // const config = coig.get('elasticsearch');
  // const service = new ElasticSearch(config);
  // const data = await service.get('query:{products: wildcarcd}')

  resJson(ctx, {test: 1233});
};

export const search = async (ctx): Promise<void> => {

  // const config = coig.get('elasticsearch');
  // const service = new ElasticSearch(config);
  // const data = await service.get('query:{products: wildcarcd}')

  resJson(ctx, ctx.values());
};