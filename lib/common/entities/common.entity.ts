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
import { RequestOptionsType } from '../types/request-options.type';
import { RequestTypeEnum } from '../types/request-type.enum';
import Handlebars from 'handlebars';

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
  build<T>(entity: T, type: ColumnKey = ColumnKey.type): T {
    if (!entity) return null;
    // const keys = this.getGlobal<Set<string>>(ColumnKey.keys) || new Set();

    for (const k of Object.keys(this)) {
      const transformer = this.getGlobal(type, k);
      const defined = this.getLocal(ColumnKey.defined, k);
      const props: ColumnProps = this.getGlobal(ColumnKey.props, k);

      if (!transformer) delete this[k];
      if (!transformer || defined) continue;
      if (typeof transformer === 'function') {
        this[k] = transformer(entity, props) ?? props.default;
      } else this[k] = entity[k as string] ?? props.default;

      if (props.nullable) {
        if (type == ColumnKey.request && !this[k]) delete this[k];
        else this[k] ??= null;
      }
    }

    return this as any;
  }

  /**
   * This method will build response-dto/request-dto
   * @see {@link Column}
   */
  buildAll<T>(entities: T[], type: ColumnKey = ColumnKey.type): T[] {
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
    const props: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!props) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${props.route}/action/select`,
      (base: string, init) =>
        async (query: ObjectLiteral, options?: RequestOptionsType) =>
          fetch(
            `${this.url(base, props, options, query)}?${StringService.toQuery(
              query,
            )}`,
            await init({ ...options, session: props.session }),
          ),
    );
  }

  get load() {
    const props: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!props) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${props.route}/action/load`,
      (base: string, init) =>
        async (id: string | string[], options?: RequestOptionsType) =>
          fetch(
            `${this.url(base, props, options)}/${ArrayService.first(id)}`,
            await init({ ...options, session: props.session }),
          ),
    );
  }

  get save() {
    const props: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!props) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${props.route}/action/save`,
      (base: string, init) =>
        async (
          entity: ObjectLiteral | CommonEntity,
          options?: RequestOptionsType,
        ) => {
          const instance: CommonEntity =
            entity instanceof CommonEntity
              ? entity.newInstance()
              : this.newInstance();

          const body = instance.build(entity, ColumnKey.request);
          const form = new FormData();
          Object.entries(body).forEach(([key, value]) =>
            form.append(key, value),
          );

          const id = (entity as any).id || (this as any).id || '';
          const config = await init({ ...options, session: props.session });
          const attach = props.modify !== false && id ? `/${id}` : '';

          return fetch(this.url(base, props, options, entity) + attach, {
            ...config,
            method: options?.method || (id ? 'PUT' : 'POST'),
            body:
              options?.type == RequestTypeEnum.form
                ? form
                : JSON.stringify(body),
          });
        },
    );
  }

  get delete() {
    const props: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!props) return null;

    return new CommonRequest(
      this.newInstance(),
      `${''}${props.route}/action/delete`,
      (base: string, init) =>
        async (id: string | string[], options?: RequestOptionsType) => {
          const config = await init({ ...options, session: props.session });

          return fetch(
            `${this.url(base, props, options)}/${ArrayService.first(id)}`,
            { ...config, method: 'DELETE' },
          );
        },
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

  private url(
    base: string,
    props: RequestProps,
    options?: RequestOptionsType,
    entity?: ObjectLiteral,
  ): string {
    const compile = (template: string) => Handlebars.compile(template)(entity);

    if (options?.pathname) return compile(options.pathname);
    const hostname = options?.hostname || base;
    return compile(`${hostname}/${options?.route || props.route}`);
  }
}
