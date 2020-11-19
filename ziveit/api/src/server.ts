import { parse as parseUrl } from 'url';
import * as Koa from 'koa';
import * as path from 'path';
import { compileApi } from 'exegesis-koa';
import * as cors from '@koa/cors';
import * as yaml from 'node-yaml';
import { Debug } from './library/Debug';
import { handleError, RESTErrorNotFound } from './helpers/errors';
const koaSwagger2 = require('koa2-swagger-ui');

export const createServer = async (options = { authenticators: null }): Promise<Koa> => {
  // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
  const exegesisOptions = Object.assign(
    {
      controllers: path.resolve(__dirname, './controllers'),
      controllersPattern: '**/*.@(ts|js)',
      autoHandleHttpErrors: false,
      allowMissingControllers: true,
    },
    { authenticators: options.authenticators },
  );

  const app = new Koa();
  app.use(cors());

  const openApiDoc = path.resolve(__dirname, '../openapi/openapi.yaml');
  const openApiDocParsed = yaml.readSync(openApiDoc);

  // Default error handler
  // TODO: osamostatnit ako balicek a skusit sa pohrad s app.on('error', (err, ctx) => {});
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const e = handleError(err);
      ctx.status = e.status;
      Object.keys(e.headers).map(h => {
        ctx.set(h, e.headers[h]);
      });
      ctx.body = Object.assign({ status: e.status }, e.body);
      if (ctx.status !== 404) {
        Debug.error(err);
      }
    }
  });

  // app.on('error', async (err, ctx) => {
  //   // toto je default error handler...
  //   debug.err(err);
  //   if (ctx) {
  //     debug.info('unable to respond to client', ctx);
  //   }
  // });
  // access log middleware

  // pre kazdy server definovany v api spravime docs endpoint
  (openApiDocParsed.servers || [{ url: '' }]).map(server => {
    const parsedUrl = parseUrl(server.url);
    let routePrefix = parsedUrl.path || '';
    if (server.variables) {
      Object.keys(server.variables).forEach(k => {
        routePrefix = routePrefix.replace(new RegExp(`{${k}}`, 'g'), server.variables[k].default);
      });
    }
    app.use(
      koaSwagger2({
        title: `${openApiDocParsed.info.title} ${openApiDocParsed.info.version} docs`, // page title
        oauthOptions: {}, // passed to initOAuth
        swaggerOptions: {
          // passed to SwaggerUi()
          url: `./openapi.json`, // link to swagger.json
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
          docExpansion: 'none',
          jsonEditor: true,
          defaultModelRendering: 'schema',
          showRequestHeaders: true,
          displayOperationId: true,
        },
        routePrefix: `${routePrefix}/docs`, // route where the view is returned
        hideTopbar: true, // hide swagger top bar
      }),
    );
  });

  // openapi middleware
  const openapiMiddleware = await compileApi(openApiDoc, exegesisOptions);
  app.use(async (ctx, next) => {
    await openapiMiddleware(ctx, next);
  });

  // handle 404 not found
  app.use(async ctx => {
    if (ctx.status === 404) {
      throw new RESTErrorNotFound('NOT_FOUND', `Route ${ctx.method} ${ctx.url} not found`);
    }
  });

  return app;
};
