import * as debug from 'debug';

export class Debug {
  static apiLog(msg: any): void {
    debug('api:')(msg);
  }

  static error(msg: any): void {
    debug('error')(msg);
  }

  static cartLog(msg: any): void {
    debug('api:cart')(msg);
  }

  static elasticLog(msg: any): void {
    debug('api:elastic')(msg);
  }
}
