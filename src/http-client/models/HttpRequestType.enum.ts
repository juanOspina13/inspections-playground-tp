export const HttpRequestType = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH',
} as const;

export type HttpRequestType = (typeof HttpRequestType)[keyof typeof HttpRequestType];
