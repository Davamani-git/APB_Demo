import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../services/application.service';
import { Application } from '../models/application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>Enrollment Manager Dashboard</h2>
      
      <div *ngIf="loading" class="loading">Loading dashboard data...</div>

      <div *ngIf="!loading">
        <div class="grid grid-4" style="margin: 20px 0;">
          <div class="card" style="background-color: #d4edda;">
            <h3>{{ readyCount }}</h3>
            <p>Ready to Submit</p>
          </div>
          <div class="card" style="background-color: #f8d7da;">
            <h3>{{ incompleteCount }}</h3>
            <p>Incomplete</p>
          </div>
          <div class="card" style="background-color: #fff3cd;">
            <h3>{{ expiringCount }}</h3>
            <p>Expiring Soon</p>
          </div>
          <div class="card" style="background-color: #d1ecf1;">
            <h3>{{ totalCount }}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <h3>Applications by Coordinator</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Coordinator</th>
              <th>Total</th>
              <th>Ready</th>
              <th>Incomplete</th>
              <th>Expiring</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let coord of coordinatorStats">
              <td>{{ coord.name }}</td>
              <td>{{ coord.total }}</td>
              <td>{{ coord.ready }}</td>
              <td>{{ coord.incomplete }}</td>
              <td>{{ coord.expiring }}</td>
            </tr>
          </tbody>
        </table>

        <h3>Expiring Documents Alert</h3>
        <div *ngIf="expiringDocuments.length === 0" class="alert alert-success">
          No documents expiring soon.
        </div>
        <table class="table" *ngIf="expiringDocuments.length > 0">
          <thead>
            <tr>
              <th>Application</th>
              <th>Document</th>
              <th>Expiration Date</th>
              <th>Days Until Expiration</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doc of expiringDocuments">
              <td>
                <a [routerLink]="['/applications', doc.applicationId]">{{ doc.applicationName }}</a>
              </td>
              <td>{{ doc.documentName }}</td>
              <td>{{ doc.expirationDate | date }}</td>
              <td>{{ doc.daysUntilExpiration }}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 20px;">
          <button class="btn btn-primary" (click)="exportData('csv')" style="margin-right: 10px;">
            Export CSV
          </button>
          <button class="btn btn-primary" (click)="exportData('pdf')">
            Export PDF
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  loading = false;
  applications: Application[] = [];
  readyCount = 0;
  incompleteCount = 0;
  expiringCount = 0;
  totalCount = 0;
  coordinatorStats: any[] = [];
  expiringDocuments: any[] = [];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.applicationService.loadApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.calculateStatistics();
        this.loadExpiringDocuments();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalCount = this.applications.length;
    this.readyCount = this.applications.filter(a => a.overallStatus === 'Ready to Submit').length;
    this.incompleteCount = this.applications.filter(a => a.overallStatus === 'Incomplete').length;
    this.expiringCount = this.applications.filter(a => a.overallStatus === 'Expiring Soon').length;

    const coordinatorMap = new Map<string, any>();
    this.applications.forEach(app => {
      if (!coordinatorMap.has(app.coordinatorId)) {
        coordinatorMap.set(app.coordinatorId, {
          name: app.coordinatorName,
          total: 0,
          ready: 0,
          incomplete: 0,
          expiring: 0
        });
      }
      const stats = coordinatorMap.get(app.coordinatorId);
      stats.total++;
      if (app.overallStatus === 'Ready to Submit') stats.ready++;
      if (app.overallStatus === 'Incomplete') stats.incomplete++;
      if (app.overallStatus === 'Expiring Soon') stats.expiring++;
    });

    this.coordinatorStats = Array.from(coordinatorMap.values());
  }

  loadExpiringDocuments(): void {
    this.applicationService.getExpiringDocuments(30).subscribe({
      next: (docs) => {
        this.expiringDocuments = docs;
      },
      error: (err) => {
        console.error('Failed to load expiring documents', err);
      }
    });
  }

  exportData(format: 'csv' | 'pdf'): void {
    this.applicationService.exportApplications(format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications_export.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Export failed', err);
      }
    });
  }
}