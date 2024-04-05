import { createAsyncThunk } from '@reduxjs/toolkit';
import 'reflect-metadata';
import {
  Entity,
  RequestPropKey,
  RequestProps,
} from '../../decorators/request-entity';
import { ColumnKey, ColumnProps, Column } from '../../decorators/column';
import { StringService } from '../../lib';
import { ObjectLiteral } from '../../types';
import { Config } from '../../config';
import { ErrorService } from '../../lib/toast';

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
    const keys = this.getGlobal<Set<string>>(ColumnKey.keys) || new Set();

    for (const k of Array.from(keys)) {
      const transformer = this.getGlobal(type, k);
      const defined = this.getLocal(ColumnKey.defined, k);
      const props: ColumnProps = this.getGlobal(ColumnKey.props, k);

      if (defined) continue;
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

  newInstance(props?: any): this {
    return new (this as any).constructor(props);
  }

  static get self(): CommonEntity {
    return new (this.prototype.constructor as any)();
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
      async (init: ObjectLiteral | CommonEntity) => {
        const instance: CommonEntity =
          init instanceof CommonEntity
            ? init.newInstance()
            : this.newInstance();

        return this.newInstance().build(
          await fetch(
            StringService.route(
              `${Config.self.base.api}/${options.route}/${
                options.id ?? (this as any).id ?? ''
              }`,
            ),
            {
              method: options.id ?? (this as any).id ? 'PUT' : 'POST',
              body: JSON.stringify(instance.build(init, ColumnKey.request)),
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
