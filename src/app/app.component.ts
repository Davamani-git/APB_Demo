import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="header">
      <div class="container">
        <h1>Provider Enrollment Readiness System</h1>
      </div>
    </div>
    <nav class="nav">
      <a routerLink="/applications" routerLinkActive="active">Applications</a>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/admin" routerLinkActive="active">Administration</a>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'Provider Enrollment Readiness System';
}