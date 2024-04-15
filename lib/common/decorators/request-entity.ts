import 'reflect-metadata';
import { CommonEntity } from '../entities/common.entity';

export enum RequestPropKey {
  type = 'ENTITY',
  props = 'ENTITY_PROPS',
  // defined = 'COLUMN_DEFINED',
  // keys = 'COLUMN_KEYS',
}

export class RequestProps {
  constructor(init?: Partial<RequestProps>) {
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
   * Default route to send all request
   */
  route: string;

  /**
   * If private then send access_token in Authorization
   */
  private: true;
}

type PropsT = Partial<Omit<RequestProps, 'self' | 'key'>>;

export function Entity(props?: PropsT) {
  return function (target: any) {
    const set = (flag: RequestPropKey, value: any) =>
      Reflect.defineMetadata(flag, value, target.prototype);

    set(RequestPropKey.type, true);
    set(RequestPropKey.props, new RequestProps(props));
  };
}
