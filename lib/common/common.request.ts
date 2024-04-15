import { createAsyncThunk } from '@reduxjs/toolkit';
import { marked } from 'marked';
import { Config } from '../../config';
import { ObjectLiteral } from './types';
import { CommonEntity } from './entities/common.entity';

export class CommonRequest<
  T extends (...args: any) => Promise<Response>,
  Args extends Parameters<T>,
> {
  constructor(
    private readonly instance: CommonEntity,
    private readonly action: string,
    private readonly fetch: (
      base: string,
      init: RequestInit,
    ) => (...args: Args) => Promise<Response>,
  ) {}

  public get exec() {
    return this.fetch(Config.self.base.api, {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window === 'undefined' ? this.server : this.client),
      },
    });
  }

  public get thunk() {
    return createAsyncThunk(this.action, (...args: Args) =>
      this.build(...args),
    );
  }

  public get build() {
    return (...args: Args) =>
      this.exec(...args).then(async (res) => {
        if (res.ok) return res.json().then((e) => this.instance.build(e));

        const err = await res.json().catch(() => ({}));
        const message = err.message || res.url;
        throw new Error(`HTTP status code: ${res.status}; '${message}'`);
      });
  }

  public get file() {
    return (filename: string, ...args: Args) =>
      this.exec(...args)
        .then((res) => res.blob())
        .then((blob) => new File([blob], filename));
  }

  public get tmp() {
    return (...args: Args) => this.file('_tmp', ...args);
  }

  public get text() {
    return (...args: Args) => this.tmp(...args).then((res) => res.text());
  }

  public get markdown() {
    return (...args: Args) =>
      this.text(...args).then((text) => marked.parse(text));
  }

  private get client(): ObjectLiteral {
    const headers: ObjectLiteral = {};

    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      Object.assign(headers, { Authorization: `Bearer ${access_token}` });
    }

    return headers;
  }

  private get server(): ObjectLiteral {
    const headers: ObjectLiteral = {};
    return headers;
  }
}
