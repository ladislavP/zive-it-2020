import * as config from 'config';
import * as fs from 'fs';
import { createServer } from './server';
import {
  apiKeyHandler,
} from './library/security';
import { Debug } from './library/Debug';
import { Init } from './library/Init';

Init.init();

createServer({
  authenticators: {
    admin: apiKeyHandler,
  },
})
  .then(async server => {

    const listenCfgs = config.get<any>('server.listen');
    for (const listenCfg of listenCfgs as any) {
      if (listenCfg.path) {
        try {
          fs.unlinkSync(listenCfg.path);
        } catch (e) {
          // nothing to do here...
        }
      }
      server
        .listen(listenCfg, () => {
          if (listenCfg.path) {
            // nastavime mod
            fs.chmodSync(listenCfg.path, '0777');
          }
          Debug.apiLog(
            `Listening on ${Object.keys(listenCfg)
              .map(k => `${k} = ${listenCfg[k]}`)
              .join(', ')}`,
          );
        })
        .on('error', e => {
          Debug.error(`Error starting server: ${e}`);
        });
    }
  })
  .catch(err => {
    Debug.error(err);
  });
