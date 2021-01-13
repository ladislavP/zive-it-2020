import { ElasticSearchService } from "../library/ElasticSearchService";
import {resJson} from "../helpers/utils";

export const openapiJson = async (ctx): Promise<void> => {
  ctx.koa.response.set('X-Auth-Type', 'application/json');
  resJson(ctx, ctx.api.openApiDoc);
};

export const search = async (ctx): Promise<void> => {
  const query = ctx.params.query.search_query;

  const client = ElasticSearchService.loadClient();

  // const configCatalogExists = await client.indices.exists({c
  //   index: 'config-katalog'
  // });

  // if (!configCatalogExists['body']) {
  // const fs = require('fs');
  //   const fileContents = fs.readFileSync('config/config-katalog.xml');
  //   const xml2js = require('xml2js');
  
  //   var parser = new xml2js.Parser({explicitArray: false});
  //   parser.parseString(fileContents, (err, result) => {
  //     // Create a dataset of items in the config file
  //     const dataset = []
  //     const menuItems = result['config']['default']['application-menu']['application-menu-item'];

  //     for (const menuItem of menuItems) {
  //       dataset.push({
  //         "Nazov": menuItem['name']
  //       })

  //       for (const submenuItem of menuItem['submenu']['application-menu-item']) {
  //         dataset.push({
  //           "Nazov": submenuItem['name']
  //         })
  //       }
  //     }

  //     // Create an index with the dataset
  //     client.indices.create({
  //       index: 'config-katalog',
  //       body: {
  //         "mappings": {
  //           "properties": {
  //             "Nazov": { "type": "text" },
  //           }
  //         }
  //       }
  //     });

  //     const body = dataset.flatMap(doc => [{ index: { _index: "config-katalog"} }, doc]);
  //     const { body: bulkResponse } = client.bulk({ refresh: true, body })
  //   });
  // }
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
          },
            {
              wildcard: {
                'column5': {
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