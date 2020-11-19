import * as config from 'config';
import * as errors from '../helpers/errors';


export const apiKeyHandler = async (pluginContext): Promise<Security> => {
  // get token from header
  const apiKey = pluginContext.req.headers['x-api-key'];

  if (!apiKey) {
    throw new errors.RESTErrorUnauthorized('API key is missing');
  }

  // load allowed API keys from config
  const configApiKeys = config.get<any>('apiKeys');

  if (!configApiKeys.includes(apiKey)) {
    throw new errors.RESTErrorUnauthorized('Invalid API key');
  }
  return {
    type: 'success',
    accessToken: '',
    tokenInfo: null,
    scopes: ['all'],
    orgInfo: null,
  };
};

export interface Security {
  type: string;
  user?: string;
  userinfo?: string;
  roles?: string[];
  accessToken: string;
  tokenInfo: any;
  scopes: string[];
  orgInfo: string;
  clubUser?: any;
}
