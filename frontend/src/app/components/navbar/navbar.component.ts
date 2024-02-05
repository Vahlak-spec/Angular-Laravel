import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isUserAuthorized: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isUserAuthorized().subscribe((isUserAuthorized) => {
      this.isUserAuthorized = isUserAuthorized;
      const storedToken = sessionStorage.getItem('token');
      if (this.isUserAuthorized && storedToken !== null) {
        this.authService.getUserName().subscribe((res) => {
          if (res.data && 'name' in res.data) {
            this.userName = res.data.name;
          }
        });
      }
    });
  }

  isHomeRouteActive(): boolean {
    return this.router.url === '/';
  }
}
