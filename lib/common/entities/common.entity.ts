import 'reflect-metadata';
import {
  Entity,
  RequestPropKey,
  RequestProps,
} from '../decorators/request-entity';
import { ColumnKey, ColumnProps, Column } from '../decorators/column';
import { ObjectLiteral } from '../types';
import moment from 'moment';
import { CommonRequest } from '../common.request';
import { ArrayService, StringService } from '..';

@Entity()
export class CommonEntity {
  assign<T extends CommonEntity>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      const enabled = this.getGlobal(ColumnKey.type, k);

      if (!enabled) continue;
      dst[k] = src[k];
      this.setLocal(ColumnKey.defined, true, k);
    }

    return dst;
  }

  /**
   * This method will build response-dto/request-dto
   * @see {@link Column}
   */
  build<T>(entity: T, type: ColumnKey = ColumnKey.type): this {
    if (!entity) return null;
    // const keys = this.getGlobal<Set<string>>(ColumnKey.keys) || new Set();

    for (const k of Object.keys(this)) {
      const transformer = this.getGlobal(type, k);
      const defined = this.getLocal(ColumnKey.defined, k);
      const props: ColumnProps = this.getGlobal(ColumnKey.props, k);

      if (!transformer || defined) continue;
      if (typeof transformer === 'function') {
        this[k] = transformer(entity, props) ?? props.default;
      } else this[k] = entity[k as string] ?? props.default;

      if (props.nullable) this[k] ??= null;
    }

    return this;
  }

  /**
   * This method will build response-dto/request-dto
   * @see {@link Column}
   */
  buildAll<T>(entities: T[], type: ColumnKey = ColumnKey.type): this[] {
    return entities?.length
      ? entities.map((item) => this.newInstance(this.defined()).build(item, type)) // prettier-ignore
      : [];
  }

  defined(): Partial<any> {
    const res = this.newInstance();

    for (const k in res) {
      const isDefined = this.getLocal(ColumnKey.defined, k);
      if (isDefined) res[k] = this[k];
      else delete res[k];
    }

    return res;
  }

  /**
   * This method will return str
   * @see {@link Column}
   */
  stringify(key: string): string {
    const keys = Object.keys(this);
    if (!keys.includes(key)) return '';

    const transformer = this.getGlobal(ColumnKey.string, key);
    const props: ColumnProps = this.getGlobal(ColumnKey.props, key);

    const serializer = (value: any) => {
      if (value === '' || value === null || value === undefined) return '';

      if (Number(value)) {
        const result = Number(value);
        return result % 1 !== 0 ? result.toFixed(2) : result.toString();
      }

      if (value instanceof Date) return value.toISOString();
      if (typeof value === 'string' && moment(value).isValid()) {
        return moment(value).toISOString();
      }

      if (typeof value === 'object' && typeof value.toString === 'function') {
        return value.toString();
      }

      return String(value);
    };

    if (typeof transformer === 'function') {
      const result = transformer(this[key], props);
      return props.serializer ? serializer(result) : String(result);
    }

    return props.serializer ? serializer(this[key]) : String(this[key]);
  }

  get select() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${options.route}/action/select`,
      (base: string, init: RequestInit) => (query: ObjectLiteral) =>
        fetch(`${base}/${options.route}?${StringService.toQuery(query)}`, init),
    );
  }

  get load() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${options.route}/action/load`,
      (base: string, init: RequestInit) => (id: string | string[]) =>
        fetch(`${base}/${options.route}/${ArrayService.first(id)}`, init),
    );
  }

  get save() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${options.route}/action/save`,
      (base: string, init: RequestInit) =>
        (entity: ObjectLiteral | CommonEntity, json: boolean = true) => {
          const instance: CommonEntity =
            entity instanceof CommonEntity
              ? entity.newInstance()
              : this.newInstance();

          const body = instance.build(entity, ColumnKey.request);

          console.log(body);

          const form = new FormData();
          Object.entries(body).forEach(([key, value]) =>
            form.append(key, value),
          );

          const headers = { ...init.headers };
          delete headers['Content-Type'];

          const id = (entity as any).id || (this as any).id || '';
          console.log({ id });

          return fetch(`${base}/${options.route}/${id}`, {
            ...init,
            headers,
            // : {
            //   ...init.headers,
            //   '': undefined,
            // },
            method: id ? 'PUT' : 'POST',
            body: json ? JSON.stringify(body) : form,
          });
        },
    );
  }

  get delete() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${options.route}/action/delete`,
      (base: string, init: RequestInit) => (id: string | string[]) =>
        fetch(`${base}/${options.route}/${ArrayService.first(id)}`, {
          ...init,
          method: 'DELETE',
        }),
    );
  }

  // private _action: string = '';
  // action(str: string) {
  //   this._action = str || '';
  // }

  newInstance(props?: any): this {
    return new (this as any).constructor(props);
  }

  static get self(): CommonEntity {
    return new (this.prototype.constructor as any)();
  }

  protected getGlobal<T = any>(type: string, key?: string): T {
    if (!key) return Reflect.getMetadata(type, this.constructor.prototype);
    return Reflect.getMetadata(type, this.constructor.prototype, key);
  }

  protected getLocal<T = any>(type: string, key: string): T {
    return Reflect.getMetadata(type, this, key);
  }

  protected setLocal(type: string, value: any, key: string) {
    return Reflect.defineMetadata(type, value, this, key);
  }
}
