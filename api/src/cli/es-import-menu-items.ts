import { ElasticSearchService } from "src/library/ElasticSearchService";
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import * as process from 'process';

// TODO test -> https://jestjs.io/ 
async function startImport(){

    const path = process.argv[2];

    if(!path){
        throw new Error("Import path is empty!");
    }

    if(!fs.existsSync(path)){
        throw new Error("Import file does not exist!");
    }

    const client = ElasticSearchService.loadClient();
    const fileContents = fs.readFileSync();
    const parser = new xml2js.Parser({explicitArray: false});

    parser.parseString(fileContents, async (err, result) => {

       if(err){
           throw err;
       }
       
      // Create a dataset of items in the config file
      const dataset = []
      const menuItems = result['config']['default']['application-menu']['application-menu-item'];

      for (const menuItem of menuItems) {
        dataset.push({
          "Nazov": menuItem['name']
        })

        for (const submenuItem of menuItem['submenu']['application-menu-item']) {
          dataset.push({
            "Nazov": submenuItem['name']
          })
        }
      }

      // TODO zrefaktorovat do service nejakej
      const configCatalogExists = await client.indices.exists({
        index: 'config-katalog'
      });

      if(!configCatalogExists){
        client.indices.create({
            index: 'config-katalog',
            body: {
              "mappings": {
                "properties": {
                  "Nazov": { "type": "text" },
                }
              }
            }
          });
      }

      const body = dataset.flatMap(doc => [{ index: { _index: "config-katalog"} }, doc]);
      await client.bulk({ refresh: true, body })
    });
}


startImport().then(() => {
    console.log("IMPORT DONE")
}).catch((err) => {
    console.log(err);
})