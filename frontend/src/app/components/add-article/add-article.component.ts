import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReject } from 'src/app/models/reject.model';
import { IResponse } from 'src/app/models/response.model';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css'],
})
export class AddArticleComponent implements OnInit {
  form: any;
  userName: string | null = null;

  constructor(
    private builder: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private notification: NotificationService
  ) {
    this.form = this.initializeForm();
  }

  ngOnInit(): void {
    this.authService.isUserAuthorized().subscribe((isAuthorized) => {
      if (isAuthorized) {
        this.authService.getUserName().subscribe((res) => {
          if (res.data && 'name' in res.data) {
            this.userName = res.data.name;
            this.form.get('author')?.setValue(this.userName);
          }
        });
      }
    });
  }

  private initializeForm(): FormGroup {
    return this.builder.group({
      title: this.builder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ])
      ),
      content: this.builder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10000),
        ])
      ),
      author: [this.userName],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.articleService.create(this.form.value).subscribe({
        next: (res: IResponse) => {
          this.notification.successMessage(res.message, res.code);
        },
        error: (rej: IReject) => {
          this.notification.errorMessage(rej.error.message, rej.status);
        },
      });
      this.clearForm();
    } else {
      this.notification.invalidFieldsMessage();
    }
  }

  clearForm() {
    this.form.reset({ author: this.userName });
    this.form.markAsUntouched();
  }
}
