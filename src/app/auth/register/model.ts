import {FormControl} from "@angular/forms";

export interface RegisterFormDataModel {
  email: string,
  username: string,
  password: string,
}

export type RegisterFormModel = {
  [K in keyof RegisterFormDataModel]: FormControl<RegisterFormDataModel[K]>;
}
