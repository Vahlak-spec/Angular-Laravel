import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IResponse } from 'src/app/models/response.model';
import { IArticle } from 'src/app/models/article.model';
import { IReject } from 'src/app/models/reject.model';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css'],
})
export class ModalPopupComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  userName: string | null = null;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private articleService: ArticleService,
    private notification: NotificationService,
    public dialogref: MatDialogRef<ModalPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.initializeForm();
    this.loadCurrentArticle(this.data.articleId);
  }

  ngOnInit(): void {
    this.authService.getUserName().subscribe((res) => {
      if (res.data && 'name' in res.data) {
        this.userName = res.data.name;
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
      author: [this.userName, { disabled: true }],
    });
  }

  private loadCurrentArticle(articleId: number) {
    this.articleService.getOne(articleId).subscribe({
      next: (res: IResponse) => {
        this.notification.successMessage(res.message, res.code);
        if (res.data && 'title' in res.data) {
          const { title, content, author } = res.data;
          this.form.setValue({
            title: title,
            content: content,
            author: author,
          });
        }
      },
      error: (rej: IReject) => {
        this.notification.errorMessage(rej.error.message, rej.status);
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.articleService
        .update(this.form.value, this.data.articleId)
        .subscribe({
          next: (res: IResponse) => {
            this.notification.successMessage(res.message, res.code);
            this.dialogref.close();
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
