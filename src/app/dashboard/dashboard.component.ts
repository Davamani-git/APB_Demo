import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { ApplicationService } from '../services/application.service';

interface DashboardStats {
  readyCount: number;
  incompleteCount: number;
  expiringCount: number;
  totalApplications: number;
  coordinatorBreakdown: any[];
  payerBreakdown: any[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    readyCount: 0,
    incompleteCount: 0,
    expiringCount: 0,
    totalApplications: 0,
    coordinatorBreakdown: [],
    payerBreakdown: []
  };
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
        console.error('Dashboard error:', err);
      }
    });
  }

  navigateToApplications(status?: string): void {
    if (status) {
      this.router.navigate(['/applications'], { queryParams: { status } });
    } else {
      this.router.navigate(['/applications']);
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'ready':
      case 'ready to submit':
        return 'status-ready';
      case 'incomplete':
        return 'status-incomplete';
      case 'expiring':
      case 'expiring soon':
        return 'status-expiring';
      default:
        return '';
    }
  }
}