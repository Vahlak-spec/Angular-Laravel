import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { IReject } from 'src/app/models/reject.model';
import { IResponse } from 'src/app/models/response.model';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: (res: IResponse) => {
        this.authService.deleteToken();
        this.notification.successMessage(res.message, res.code);
        this.router.navigate(['']);
      },
      error: (rej: IReject) => {
        this.notification.errorMessage(rej.error.message, rej.status);
      },
    });
  }
}
