import { Draft } from '@reduxjs/toolkit';

export type ObjectLiteral<T = any> = { [name: string]: T };

export type DeepEntity<T> = T | Draft<T>;

export type TreeT<T> = { [path: string]: TreeT<T> | T };
