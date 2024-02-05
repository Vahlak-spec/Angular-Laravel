import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ILogin } from '../models/login.model';
import { IRegistration } from '../models/registration.model';
import { IResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthorized = new BehaviorSubject<boolean>(false);
  httpOptions = {};

  constructor(private http: HttpClient) {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken !== null) {
      this.setToken(storedToken);
    }
  }

  register(data: IRegistration): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/api/register`,
      data
    );
  }

  login(data: ILogin): Observable<IResponse> {
    return this.http.post<IResponse>(`${environment.apiUrl}/api/login`, data);
  }

  logout(): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/api/logout`,
      null,
      this.httpOptions
    );
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    this.isAuthorized.next(true);
  }

  deleteToken() {
    this.isAuthorized.next(false);
    sessionStorage.removeItem('token');
  }

  isUserAuthorized(): Observable<boolean> {
    return this.isAuthorized;
  }

  getUserName(): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/api/me`,
      null,
      this.httpOptions
    );
  }
}
