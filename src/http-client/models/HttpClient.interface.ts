import type { IHttpRequestParams } from './HttpRequestParams.interface';

export interface IHttpClient {
  request<R, P = void>(parameters: IHttpRequestParams<P>): Promise<R>;
}
