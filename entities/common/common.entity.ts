import { createAsyncThunk } from '@reduxjs/toolkit';
import 'reflect-metadata';

import {
  PropertyKey,
  PropertyProps,
  Property,
} from '../../decorators/property';
import {
  Entity,
  RequestPropKey,
  RequestProps,
} from '../../decorators/request-entity';
import { ColumnKey, ColumnProps, Column } from '../../decorators/column';
import { ErrorService, StringService } from '../../lib';
import { ObjectLiteral } from '../../types';
import { Config } from '../../config';

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
  build<T>(entity: T, request?: true): this {
    if (!entity) return null;
    // const res = new (this as any).constructor();

    for (const k of this.getGlobal(ColumnKey.keys) || []) {
      const req = request && this.getGlobal(ColumnKey.request, k);
      const transformer = req || this.getGlobal(ColumnKey.type, k);

      const defined = this.getLocal(ColumnKey.defined, k);
      if (defined && !req) continue;

      if (typeof transformer !== 'function') {
        this[k] = entity[k as string];
        continue;
      }

      const props: ColumnProps = this.getGlobal(ColumnKey.props, k);

      this[k] =
        transformer(entity, new PropertyProps({ ...props, self: this })) ??
        props.default;
    }

    return this;
  }

  /**
   * This method will build response-dto/request-dto
   * @see {@link Column}
   */
  buildAll<T>(entities: T[], request?: true): this[] {
    return entities?.length
      ? entities.map((item) =>
          this.newInstance(this.defined()).build(item, request),
        )
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

  newInstance(props?: any): this {
    return new (this as any).constructor(props);
  }

  static get self(): CommonEntity {
    return new (this.prototype.constructor as any)();
  }

  /**
   * This method will return info about Column
   * @see {@link Property}
   */
  static get columns(): ObjectLiteral<PropertyProps> {
    const saved = this.prototype.constructor['_columns'];
    if (saved) return saved;

    const options = {};
    for (const k of this.self.getGlobal(PropertyKey.keys) || []) {
      const props = this.self.getGlobal(PropertyKey.props, k);
      if (props) options[k] = props;
    }

    return (this.prototype.constructor['_columns'] = options);
  }

  // NOTE: Singleton
  private static _columns: ObjectLiteral<PropertyProps>;
  get columns(): ObjectLiteral<PropertyProps> {
    return this.constructor['columns'];
  }

  get select() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return createAsyncThunk(
      options.action?.select ?? 'action/load',
      async (query: ObjectLiteral) => {
        return {
          options: query,
          res: this.newInstance().build(
            await fetch(
              `${Config.self.base.api}/${options.route}?${StringService.toQuery(
                query,
              )}`,
            ).then((res) => (ErrorService.validate(res), res.json())),
          ),
        };
      },
    );
  }

  get findOne() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return createAsyncThunk(
      options.action?.findOne ?? 'action/findOne',
      async () => {
        return this.newInstance().build(
          await fetch(
            StringService.route(
              `${Config.self.base.api}/${options.route}/${
                options.id ?? (this as any).id ?? ''
              }`,
            ),
          ).then((res) => (ErrorService.validate(res), res.json())),
        );
      },
    );
  }

  get save() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return createAsyncThunk(
      options.action?.save ?? 'action/save',
      async (init: ObjectLiteral) => {
        console.log(init);

        return this.newInstance().build(
          await fetch(
            StringService.route(
              `${Config.self.base.api}/${options.route}/${
                options.id ?? (this as any).id ?? ''
              }`,
            ),
            {
              method: options.id ?? (this as any).id ? 'PUT' : 'POST',
              body: JSON.stringify(this.newInstance(init).build(this, true)),
              headers: { 'Content-Type': 'application/json' },
            },
          ).then((res) => (ErrorService.validate(res), res.json())),
        );
      },
    );
  }

  get delete() {
    const options: RequestProps = this.getGlobal(RequestPropKey.props);
    if (!options) return null;

    return createAsyncThunk(
      options.action?.delete ?? 'action/delete',
      async () => {
        return this.newInstance().build(
          await fetch(
            StringService.route(
              `${Config.self.base.api}/${options.route}/${
                options.id ?? (this as any).id ?? ''
              }`,
            ),
            { method: 'DELETE' },
          ).then((res) => (ErrorService.validate(res), res.json())),
        );
      },
    );
  }

  protected getGlobal(type: string, key?: string) {
    if (!key) return Reflect.getMetadata(type, this.constructor.prototype);
    return Reflect.getMetadata(type, this.constructor.prototype, key);
  }

  protected getLocal(type: string, key: string) {
    return Reflect.getMetadata(type, this, key);
  }

  protected setLocal(type: string, value: any, key: string) {
    return Reflect.defineMetadata(type, value, this, key);
  }
}
