import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RegisterFormModel} from "./model";
import {AuthService} from "../../http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatCheckboxModule, MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private _authService = inject(AuthService)
  private _matSnackBar = inject(MatSnackBar)
  private _router = inject(Router)

  form = new FormGroup<RegisterFormModel>({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.minLength(8)]},),
    username: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  })

  onSignup() {
    if (this.form.valid) {
      this._authService.register(this.form.getRawValue()).subscribe({
        next: () => {
          this._matSnackBar.open('You Successfully Registered!', 'Okay');
          this._router.navigate(['/login'])
        },
        error: (message) => {
          this._matSnackBar.open(`Something went wrong! \n${message}`, 'Okay')
        }
      })
    }
  }
}
