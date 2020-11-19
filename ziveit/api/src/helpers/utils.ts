import {ExegesisContext} from "exegesis-koa";

export const prop = (object, path, defaultValue = null) => {
  const val = path
    .trim()
    .split('.')
    .reduce((o, x) => {
      return typeof o === 'undefined' || o === null ? defaultValue : o[x];
    }, object);
  if (typeof val === 'undefined') {
    return defaultValue;
  }
  return val;
};

export function reqQueryPValue(req, param, defaultValue = null) {
  if (req.params.query[param] === undefined) {
    return defaultValue;
  }

  return req.params.query[param];
}

export function reqParamValue(req, param, defaultValue = null) {
  return reqQueryPValue(req, param, defaultValue);
}

export function reqPathPValue(req, param, defaultValue = null) {
  if (req.params.path[param] === undefined) {
    return defaultValue;
  }

  return req.params.path[param];
}

export function reqBody(req) {
  return req.requestBody;
}

export function reqHeader(req, h) {
  return req.req.headers[h];
}

export function resJson(ctx, json: any) {
  ctx.koa.response.body = json;
}
export function jsonRes(ctx, json: any) {
  ctx.koa.response.body = json;
}

export function resRedirect(ctx, url: string, status = 302) {
  ctx.res.set('Content-Type', 'text/html');
  ctx.res.setStatus(status);
  ctx.res.set('Location', url);
}

export function reqLimitOffset(ctx: ExegesisContext): { limit: number; offset: number } {
  return {
    limit: reqQueryPValue(ctx, 'limit', 10),
    offset: reqQueryPValue(ctx, 'offset', 0),
  };
}

