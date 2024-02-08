export interface IJwtPayload {
  id: number;
  email: string;
  nickname: string;
}

export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
}
