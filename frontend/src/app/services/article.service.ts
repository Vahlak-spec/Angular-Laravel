import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IArticle } from '../models/article.model';
import { IResponse } from '../models/response.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  token: string | null = null;
  httpOptions = {};

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.authService.isUserAuthorized().subscribe((res) => {
      this.token = sessionStorage.getItem('token');
      this.httpOptions = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        }),
      };
    });
  }

  getAll(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(`${environment.apiUrl}/api/articles`);
  }

  getOne(articleId: number): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      `${environment.apiUrl}/api/articles/${articleId}`,
      this.httpOptions
    );
  }

  create(article: IArticle): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      `${environment.apiUrl}/api/articles`,
      article,
      this.httpOptions
    );
  }

  update(article: IArticle, articleId: number): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      `${environment.apiUrl}/api/articles/${articleId}`,
      article,
      this.httpOptions
    );
  }

  delete(articleId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      `${environment.apiUrl}/api/articles/${articleId}`,
      this.httpOptions
    );
  }
}
