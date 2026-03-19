import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { IHttpClient } from './HttpClient.interface';
import type { IHttpRequestParams } from './HttpRequestParams.interface';
import { HttpRequestType } from './HttpRequestType.enum';
import { UrlUtils } from './UrlUtils';

const TOKEN_KEY = 'user-token';

export class HttpClientAxios implements IHttpClient {
  async request<R, P = void>(parameters: IHttpRequestParams<P>): Promise<R> {
    const { requestType, url, requiresToken, payload, headers } = parameters;

    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (headers) {
      options.headers = { ...options.headers, ...headers };
    }

    if (requiresToken && options.headers) {
      const token = this.getJwtToken();
      if (token) {
        (options.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
    }

    switch (requestType) {
      case HttpRequestType.get: {
        const fullUrl = UrlUtils.getFullUrlWithParams(url, payload as unknown as Record<string, unknown>);
        return (await axios.get(fullUrl, options))?.data as R;
      }
      case HttpRequestType.post:
        return (await axios.post(url, payload, options))?.data as R;
      case HttpRequestType.put:
        return (await axios.put(url, payload, options))?.data as R;
      case HttpRequestType.patch:
        return (await axios.patch(url, payload, options))?.data as R;
      case HttpRequestType.delete:
        return (await axios.delete(url, options))?.data as R;
      default:
        throw new Error(`Unsupported request type: ${requestType}`);
    }
  }

  private getJwtToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      return JSON.parse(token);
    } catch {
      return token;
    }
  }
}
