import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { DashboardStats, StatusCount } from '../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container" *ngIf="stats">
      <h2>Provider Enrollment Dashboard</h2>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-value">{{ stats.totalApplications }}</div>
          <div class="stat-label">Total Applications</div>
        </div>
        <div class="stat-card ready" (click)="filterByStatus('Ready to Submit')">
          <div class="stat-value">{{ getStatusCount('Ready to Submit') }}</div>
          <div class="stat-label">Ready to Submit</div>
        </div>
        <div class="stat-card incomplete" (click)="filterByStatus('Incomplete')">
          <div class="stat-value">{{ getStatusCount('Incomplete') }}</div>
          <div class="stat-label">Incomplete</div>
        </div>
        <div class="stat-card expiring" (click)="filterByStatus('Expiring Soon')">
          <div class="stat-value">{{ getStatusCount('Expiring Soon') }}</div>
          <div class="stat-label">Expiring Soon</div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <h3>Applications by Coordinator</h3>
          <div class="coordinator-list">
            <div class="coordinator-item" *ngFor="let coord of stats.byCoordinator" 
                 (click)="filterByCoordinator(coord.coordinatorName)">
              <div class="coordinator-info">
                <span class="coordinator-name">{{ coord.coordinatorName }}</span>
                <span class="coordinator-count">{{ coord.count }} applications</span>
              </div>
              <div class="coordinator-bar">
                <div class="bar-fill" [style.width.%]="getPercentage(coord.count, stats.totalApplications)"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Applications by Payer</h3>
          <div class="payer-list">
            <div class="payer-item" *ngFor="let payer of stats.byPayer" 
                 (click)="filterByPayer(payer.payerName)">
              <div class="payer-info">
                <span class="payer-name">{{ payer.payerName }}</span>
                <span class="payer-count">{{ payer.count }} applications</span>
              </div>
              <div class="payer-bar">
                <div class="bar-fill" [style.width.%]="getPercentage(payer.count, stats.totalApplications)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="priority-section">
        <h3>High Priority Applications</h3>
        <div class="priority-list">
          <div class="priority-item" *ngFor="let app of stats.highPriorityApplications" 
               (click)="navigateToApplication(app.id)">
            <div class="priority-header">
              <span class="app-name">{{ app.providerName }}</span>
              <span class="priority-score high">Priority: {{ app.priorityScore }}</span>
            </div>
            <div class="priority-details">
              <span class="status-badge" [class]="'status-' + app.status.toLowerCase().replace(' ', '-')">
                {{ app.status }}
              </span>
              <span class="app-id">ID: {{ app.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!stats">
      <p>Loading dashboard...</p>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .dashboard-container h2 {
      margin: 0 0 2rem 0;
      color: #333;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border-top: 4px solid #1976d2;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .stat-card.total {
      border-top-color: #1976d2;
    }
    .stat-card.ready {
      border-top-color: #4caf50;
    }
    .stat-card.incomplete {
      border-top-color: #ff9800;
    }
    .stat-card.expiring {
      border-top-color: #f44336;
    }
    .stat-value {
      font-size: 3rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      font-size: 1rem;
      color: #666;
      font-weight: 500;
    }
    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .chart-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .chart-card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }
    .coordinator-list,
    .payer-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .coordinator-item,
    .payer-item {
      cursor: pointer;
      padding: 0.75rem;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .coordinator-item:hover,
    .payer-item:hover {
      background: #f5f5f5;
    }
    .coordinator-info,
    .payer-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .coordinator-name,
    .payer-name {
      font-weight: 600;
      color: #333;
    }
    .coordinator-count,
    .payer-count {
      color: #666;
      font-size: 0.9rem;
    }
    .coordinator-bar,
    .payer-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #1976d2, #42a5f5);
      transition: width 0.3s;
    }
    .priority-section {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .priority-section h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }
    .priority-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .priority-item {
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid #d32f2f;
      background: #fff5f5;
      cursor: pointer;
      transition: background 0.2s;
    }
    .priority-item:hover {
      background: #ffebee;
    }
    .priority-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .app-name {
      font-weight: 600;
      color: #333;
    }
    .priority-score {
      font-weight: 700;
      color: #d32f2f;
    }
    .priority-details {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .status-ready-to-submit {
      background: #4caf50;
      color: white;
    }
    .status-incomplete {
      background: #ff9800;
      color: white;
    }
    .status-expiring-soon {
      background: #f44336;
      color: white;
    }
    .app-id {
      color: #666;
      font-size: 0.9rem;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading dashboard:', err)
    });
  }

  getStatusCount(status: string): number {
    if (!this.stats) return 0;
    const found = this.stats.byStatus.find(s => s.status === status);
    return found ? found.count : 0;
  }

  getPercentage(count: number, total: number): number {
    return total > 0 ? (count / total) * 100 : 0;
  }

  filterByStatus(status: string): void {
    window.location.href = `#/applications?status=${encodeURIComponent(status)}`;
  }

  filterByCoordinator(coordinator: string): void {
    window.location.href = `#/applications?coordinator=${encodeURIComponent(coordinator)}`;
  }

  filterByPayer(payer: string): void {
    window.location.href = `#/applications?payer=${encodeURIComponent(payer)}`;
  }

  navigateToApplication(id: string): void {
    window.location.href = `#/applications/${id}`;
  }
}