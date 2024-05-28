export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'


export interface JWTModel {
  [ACCESS_TOKEN]: string,
  [REFRESH_TOKEN]: string
}
