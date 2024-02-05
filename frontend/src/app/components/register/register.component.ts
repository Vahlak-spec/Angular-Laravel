import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IResponse } from 'src/app/models/response.model';
import { IReject } from 'src/app/models/reject.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.form = this.initializeForm();
  }

  private initializeForm(): FormGroup {
    return this.builder.group({
      name: this.builder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ])
      ),
      email: this.builder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
        ])
      ),
      password: this.builder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ])
      ),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe({
        next: (res: IResponse) => {
          if (res.code === 200 && res.data && 'token' in res.data) {
            this.authService.setToken(res.data.token);
            this.notification.successMessage(res.message, res.code);

            this.clearForm();
            this.router.navigate(['']);
          } else {
          }
        },
        error: (rej: IReject) => {
          this.notification.errorMessage(rej.error.message, rej.status);
          this.authService.deleteToken();
        },
      });
    } else {
      this.notification.invalidFieldsMessage();
      this.authService.deleteToken();
    }
  }

  clearForm() {
    this.form.reset();
    this.form.markAsUntouched();
  }
}
