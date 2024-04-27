import { Draft } from '@reduxjs/toolkit';

export type ObjectLiteral<T = any> = { [name: string]: T };

export type DeepEntity<T> = T | Draft<T>;

export type TreeT<T> = { [path: string]: TreeT<T> | T };

export type DispatchComponent<T, F> = {
  [K in keyof T]: (e: F) => T[K];
};
