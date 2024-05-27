import NodeCache from 'node-cache';

export class ServerService {
  public readonly cache: NodeCache;

  private static instance: ServerService;
  private constructor() {
    this.cache = new NodeCache();
  }

  static get self(): ServerService {
    return (this.instance ||= new ServerService());
  }
}
