import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Provider Enrollment Work Management</h1>
        <nav>
          <a routerLink="/applications" routerLinkActive="active">Applications</a>
          <a routerLink="/rule-sets" routerLinkActive="active">Rule Sets</a>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        </nav>
      </header>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .app-header {
      background: #1976d2;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .app-header h1 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }
    .app-header nav {
      display: flex;
      gap: 1.5rem;
    }
    .app-header nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .app-header nav a:hover,
    .app-header nav a.active {
      background: rgba(255,255,255,0.2);
    }
    .app-content {
      flex: 1;
      padding: 2rem;
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'Provider Enrollment Work Management';
}