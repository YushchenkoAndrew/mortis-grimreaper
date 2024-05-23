import { GetServerSidePropsContext } from 'next';
import { RequestTypeEnum } from './request-type.enum';

export type RequestOptionsType = Partial<{
  session: boolean;
  type: RequestTypeEnum;
  headers: HeadersInit;
  cache: RequestCache;
  route: string;
  method: string;
  pathname: string;
  hostname: string;
  ctx: GetServerSidePropsContext;
}>;
