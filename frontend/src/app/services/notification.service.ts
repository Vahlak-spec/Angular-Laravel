import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  successMessage(responseMessage: string, responseCode: number) {
    this.toastr.success(responseMessage, `${responseCode}`, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  errorMessage(rejectMessage: string, rejectCode: number) {
    this.toastr.error(rejectMessage, `${rejectCode}`, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  notAuthorizedMessage() {
    this.toastr.error("You're not authorized", 'Error', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  invalidFieldsMessage() {
    this.toastr.error('All fields must be valid', 'Error', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  logoutSuccessMessage() {
    this.toastr.success('Logged out successfully', '200', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }
}
