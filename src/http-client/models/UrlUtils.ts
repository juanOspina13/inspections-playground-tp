export class UrlUtils {
  static getFullUrlWithParams(url: string, params?: Record<string, unknown>): string {
    if (!params || typeof params !== 'object') {
      return url;
    }

    const queryString = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    return queryString ? `${url}?${queryString}` : url;
  }
}
