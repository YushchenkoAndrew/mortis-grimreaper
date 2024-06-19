import { Draft } from '@reduxjs/toolkit';

export type ObjectLiteral<T = any> = { [name: string]: T };

export type DeepEntity<T> = T | Draft<T>;

export type TreeT<T> = { [path: string]: TreeT<T> | T };

export type DispatchComponent<T, F> = {
  [K in keyof T]: (e: F) => T[K];
};

export type OnlyStringValueOf<
  T extends object,
  K extends keyof T = keyof T,
  V = undefined,
> = K extends string
  ? T[K] extends string
    ? V extends undefined
      ? K
      : V
    : never
  : never;

export type ZodErrorT<T extends object> = {
  [K in keyof T]: OnlyStringValueOf<T, K, string[]>;
};

type Increment<N extends number> = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20, ...number[]][N] // prettier-ignore

export type Unwrap<
  T extends ObjectLiteral,
  N extends number = 0,
  Key = keyof T,
> = N extends 20
  ? never
  : Key extends string
  ? T[Key] extends Exclude<ObjectLiteral, Symbol>
    ? `${Key}.${Unwrap<T[Key], Increment<N>>}`
    : `${Key}`
  : never;
