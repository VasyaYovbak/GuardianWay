import {FormControl} from "@angular/forms";

export interface LoginFormDataModel {
  email: string,
  password: string,
}

export type LoginFormModel = {
  [K in keyof LoginFormDataModel]: FormControl<LoginFormDataModel[K]>;
}
