export interface LoginUser {
  username: string;
  password: string;
}

export interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LogoutRequestBody {
  token: string;
  client_id: string;
}
