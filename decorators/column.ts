import 'reflect-metadata';
import { CommonEntity } from '../entities/common/common.entity';

export enum ColumnKey {
  type = 'COLUMN',
  props = 'COLUMN_PROPS',
  request = 'COLUMN_REQUEST',
  defined = 'COLUMN_DEFINED',
  keys = 'COLUMN_KEYS',
}

export class ColumnProps {
  constructor(init?: Partial<ColumnProps>) {
    for (const k in init || {}) this[k] = init[k];
  }

  /**
   * This variable contains current ```this```
   * This value will be defined dynamically in {@link CommonEntity#build}
   */
  self: CommonEntity;

  /**
   * This variable contains current key name
   * This value will be defined dynamically in {@link CommonEntity#build}
   */
  key: string;

  /**
   * Define default value that will be assigned if entity doesn't has requested
   * property, default values is ```null```
   */
  default: any;

  /**
   * If set to ```true``` then will set ```null``` if property is undefined
   */
  nullable: true;
}

type TransformerT = (entity: any, props: ColumnProps) => any;
type PropsT = Partial<Omit<ColumnProps, 'self' | 'key'>>;

export function Column(transformer?: TransformerT | PropsT, props?: PropsT) {
  return function (target: any, key: string) {
    const set = (flag: ColumnKey, value: any) =>
      Reflect.defineMetadata(flag, value, target, key);

    const get = (flag: ColumnKey) => Reflect.getMetadata(flag, target, key);

    const keys: Set<string> = Reflect.getMetadata(ColumnKey.keys, target) || new Set(); // prettier-ignore
    Reflect.defineMetadata(ColumnKey.keys, keys.add(key), target);

    if (typeof transformer == 'function') {
      set(ColumnKey.type, transformer);
      set(ColumnKey.props, new ColumnProps({ ...props, key }));
      return;
    }

    set(ColumnKey.type, get(ColumnKey.type) ?? true);
    set(ColumnKey.props,new ColumnProps({ ...transformer, ...get(ColumnKey.props), key })); // prettier-ignore
  };
}

export function Request(transformer?: TransformerT | PropsT, props?: PropsT) {
  return function (target: any, key: string) {
    Column()(target, key);
    Reflect.defineMetadata(
      ColumnKey.request,
      typeof transformer == 'function' ? transformer : true,
      target,
      key,
    );
  };
}
