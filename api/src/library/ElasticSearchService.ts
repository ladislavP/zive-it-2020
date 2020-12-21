import {Client} from '@elastic/elasticsearch';
import * as config from 'config';


export class ElasticSearchService {
    
    /**
     * Inicialize ES client
     * @returns Client
     */
    static loadClient() : Client {
        const elasticsearchConfig = config.get('elasticsearch');
        return new Client(elasticsearchConfig);
    }

}