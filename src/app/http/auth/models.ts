export interface RegisterDTOModel {
  email: string,
  password: string,
  username: string,
}

export interface LoginDTOModel {
  email: string,
  password: string,
}

export interface LoginResponseModel {
  access_token: string,
  refresh_token: string
}
