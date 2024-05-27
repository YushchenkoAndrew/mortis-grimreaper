import { marked } from 'marked';
import { Config } from '../../config';
import { ObjectLiteral } from './types';
import { v4 as uuid } from 'uuid';
import { URL } from 'url';

export class NumberService {
  static random(max: number, min: number = 0, seed: string = '') {
    return Math.floor(this.seed(seed || uuid()) * (max - min)) + min;
  }

  static mantissa(n: number) {
    for (; n % 1 !== 0; n *= 10);
    return n;
  }

  static seed(seed: string) {
    let h1 = 1779033703, h2 = 3144134277; // prettier-ignore
    let h3 = 1013904242, h4 = 2773480762; // prettier-ignore

    for (let i = 0, k; i < seed.length; i++) {
      k = seed.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }

    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

    h1 ^= h2 ^ h3 ^ h4;

    h1 |= 0;
    h1 = (h1 + 0x9e3779b9) | 0;
    let t = h1 ^ (h1 >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
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

  static isUrlValid(url: string): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  static route(str: string) {
    return str.replace(/\/$/, '');
  }

  static toQuery(obj: ObjectLiteral = {}) {
    const params = [] as string[];

    for (var p in obj) {
      if (!obj.hasOwnProperty(p)) continue;
      if (obj[p] === null || obj[p] === undefined) continue;
      params.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }

    return params.join('&');
  }

  static href(...path: string[]): string {
    return `${Config.self.base.web}/${path.join('/')}`;
  }

  static async markdown(src: string): Promise<string> {
    const markdown = await marked.parse(src);
    return `
    <div>
      <style scoped>@import url("${Config.self.base.web}/styles/markdown.css");</style>
      ${markdown}
    </div>`;
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
