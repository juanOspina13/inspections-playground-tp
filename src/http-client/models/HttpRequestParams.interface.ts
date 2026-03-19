import { HttpRequestType } from './HttpRequestType.enum';

export interface IHttpRequestParams<P = void> {
  requestType: HttpRequestType;
  url: string;
  payload?: P;
  headers?: Record<string, string>;
  requiresToken?: boolean;
}
