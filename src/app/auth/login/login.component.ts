import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginFormModel} from "./model";
import {HttpErrorResponse} from "@angular/common/http";
import {JwtService} from "../../http/jwt";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private _authService = inject(AuthService)
  private _matSnackBar = inject(MatSnackBar)
  private _router = inject(Router)
  private _jwtService = inject(JwtService)

  form = new FormGroup<LoginFormModel>({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.minLength(8)]},),
  })

  constructor(public dialog: MatDialog) {
  }

  onLogin() {
    if (this.form.valid) {
      this._authService.login(this.form.getRawValue()).subscribe({
        next: (jwt) => {
          this._matSnackBar.open('You Successfully Logged In!', 'Okay');
          this._jwtService.setJWT(jwt);
          this._router.navigate(['/home'])
        },
        error: (error: HttpErrorResponse) => {
          this._matSnackBar.open(`Something went wrong! \n${error.error}`, 'Okay')
        }
      })
    }
  }


  onForgot() {
    this.dialog.open(ForgotDialog, {
      width: '300px',
      height: '295px'
    });
  }
}


@Component({
  selector: 'app-forgot-dialog',
  template: `<img src="https://media1.tenor.com/m/aSkdq3IU0g0AAAAC/laughing-cat.gif" alt="((">
  <audio #audio [volume]="0.05" src="https://www.myinstants.com/media/sounds/cat-laugh-meme-1.mp3"></audio>`,
  styles: `:host {
    border-radius: 10px;
  }`
})
export class ForgotDialog implements AfterViewInit {
  @ViewChild('audio', {read: ElementRef<HTMLAudioElement>}) audioController!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit() {
    this.audioController.nativeElement.play()
  }
}
