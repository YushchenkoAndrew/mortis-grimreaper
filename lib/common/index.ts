import { Config } from '../../config';
import { ObjectLiteral } from './types';

export class NumberService {
  static random(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

export class StringService {
  static capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static filter(...items: string[]) {
    return items.filter(Boolean).join(' ');
  }

  static replaceAt(str: string, val: string, index: number) {
    return str.substring(0, index) + val + str.substring(index + val.length);
  }

  static humanize(str: string, sep: string = '_') {
    const [word, ...sentence] = str.split(sep);
    return [this.capitalize(word), ...sentence].join(' ');
  }

  static toSection(name: string): string {
    return name.replace(/ /g, '_').replace(/\//g, '').toLowerCase();
  }

  static route(str: string) {
    return str.replace(/\/$/, '');
  }

  static toQuery(obj: ObjectLiteral = {}) {
    const params = [] as string[];

    for (var p in obj) {
      if (!obj.hasOwnProperty(p)) continue;
      params.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }

    return params.join('&');
  }

  static href(...path: string[]): string {
    return `${Config.self.base.web}/${path.join('/')}`;
  }
}

export class ArrayService {
  static isEqual<T>(a: T[], b: T[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    return a.reduce((acc, curr, i) => acc && curr == b[i], true);
  }

  static first<T>(params: T | T[]): T {
    if (Array.isArray(params)) return params[0];
    return params;
  }
}

export class ObjectService {
  static keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as any;
  }
}
