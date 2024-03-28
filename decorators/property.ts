import 'reflect-metadata';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CommonEntity } from '../entities/common/common.entity';

export enum PropertyKey {
  type = 'PROPERTY',
  props = 'PROPERTY_PROPS',
  defined = 'PROPERTY_DEFINED',
  keys = 'PROPERTY_KEYS',
}

export class PropertyProps {
  constructor(init?: Partial<PropertyProps>) {
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
   * Entity property
   * Will hide this field to user
   */
  hidden: true;

  /**
   * Entity property
   * If set then it will displayed in related block
   */
  related: true;

  /**
   * Entity property
   * If set then it will be required aka not empty
   */
  required: true;

  /**
   * Entity property
   * Will show specified icon depends on a state
   */
  icon: { [state: string]: IconProp };

  /**
   * Entity property
   * Will show this value based on index
   */
  index: number;

  /**
   * Entity property
   * Will display column with the next width
   */
  className: string;
}

type TransformerT = (entity: any, props: PropertyProps) => any;
type PropsT = Partial<Omit<PropertyProps, 'self' | 'key'>>;

export function Property(transformer?: TransformerT | PropsT, props?: PropsT) {
  return function (target: any, key: string) {
    const set = (flag: PropertyKey, value: any) =>
      Reflect.defineMetadata(flag, value, target, key);

    const keys = Reflect.getMetadata(PropertyKey.keys, target) || [];
    Reflect.defineMetadata(PropertyKey.keys, [...keys, key], target);

    if (typeof transformer == 'function' || typeof transformer == 'undefined') {
      set(PropertyKey.type, transformer ?? true);
      set(PropertyKey.props, new PropertyProps({ ...(props || {}), key }));
      return;
    }

    set(PropertyKey.type, true);
    set(PropertyKey.props, new PropertyProps({ ...transformer, key }));
  };
}
