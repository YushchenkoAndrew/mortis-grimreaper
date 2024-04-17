import { createAsyncThunk } from '@reduxjs/toolkit';
import { marked } from 'marked';
import { Config } from '../../config';
import { ObjectLiteral } from './types';
import { CommonEntity } from './entities/common.entity';
import { RequestOptionsType } from './types/request-options.type';
import { RequestTypeEnum } from './types/request-type.enum';

export class CommonRequest<
  T extends (...args: any) => Promise<Response>,
  Args extends Parameters<T>,
> {
  constructor(
    private readonly instance: CommonEntity,
    private readonly action: string,
    private readonly fetch: (
      base: string,
      init: (options?: RequestOptionsType) => Promise<RequestInit>,
    ) => (...args: Args) => Promise<Response>,
  ) {}

  public get exec() {
    return this.fetch(
      Config.self.base.api,
      async (options?: RequestOptionsType) => {
        const headers: ObjectLiteral = { ...options?.headers };

        if (!options?.type || options.type == RequestTypeEnum.json) {
          headers['Content-Type'] ||= 'application/json';
        }

        if (options?.session) {
          const getSession = async () => {
            if (typeof window !== 'undefined') {
              const { getSession } = await import('next-auth/react');
              return getSession();
            }

            const { getServerSession } = await import('next-auth');
            return getServerSession();
          };

          const auth: { access_token: string } = (await getSession()) as any;

          if (auth.access_token) {
            headers.Authorization ||= `Bearer ${auth.access_token}`;
          }
        }

        return { headers };
      },
    );
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
}