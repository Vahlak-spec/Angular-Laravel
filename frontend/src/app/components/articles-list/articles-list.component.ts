import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';
import { NotificationService } from 'src/app/services/notification.service';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { IResponse } from 'src/app/models/response.model';
import { IArticle } from 'src/app/models/article.model';
import { IReject } from 'src/app/models/reject.model';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent implements OnInit {
  dataSource!: MatTableDataSource<IArticle>;
  displayedColumns: string[] = [];
  isUserAuthorized: boolean = false;
  isEditing: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private articleService: ArticleService,
    private auth: AuthService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscribeToAuthChanges();
    this.showArticles();
  }

  private initializeColumns() {
    if (this.isUserAuthorized) {
      this.displayedColumns = [
        'id',
        'title',
        'content',
        'author',
        'edit',
        'delete',
      ];
    } else {
      this.displayedColumns = ['id', 'title', 'content', 'author'];
    }
  }

  private subscribeToAuthChanges() {
    this.auth.isUserAuthorized().subscribe((isUserAuthorized) => {
      this.isUserAuthorized = isUserAuthorized;
      this.initializeColumns();
    });
  }

  private showArticles() {
    this.articleService.getAll().subscribe((res: IResponse) => {
      if (Array.isArray(res.data)) {
        this.dataSource = new MatTableDataSource<IArticle>(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  openModal(articleId: number) {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      width: '50%',
      data: {
        articleId: articleId,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.showArticles();
    });
  }

  deleteArticle(articleId: number) {
    this.articleService.delete(articleId).subscribe({
      next: (res: IResponse) => {
        this.notification.successMessage(res.message, res.code);
        this.showArticles();
      },
      error: (rej: IReject) => {
        this.notification.errorMessage(rej.error.message, rej.status);
      },
    });
  }
}
