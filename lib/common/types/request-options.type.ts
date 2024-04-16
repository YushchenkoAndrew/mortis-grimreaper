import { RequestTypeEnum } from './request-type.enum';

export type RequestOptionsType = Partial<{
  type: RequestTypeEnum;
}>;
