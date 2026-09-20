import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../services/application.service';
import { Application } from '../models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="application-list-container">
      <div class="header-section">
        <h2>Provider Enrollment Applications</h2>
        <div class="controls">
          <label>
            Sort by:
            <select [(ngModel)]="sortBy" (change)="onSortChange()">
              <option value="default">Default</option>
              <option value="priority">Priority Score</option>
              <option value="risk">Risk Score</option>
              <option value="status">Status</option>
            </select>
          </label>
          <label>
            Filter by Status:
            <select [(ngModel)]="filterStatus" (change)="onFilterChange()">
              <option value="all">All</option>
              <option value="Ready to Submit">Ready to Submit</option>
              <option value="Incomplete">Incomplete</option>
              <option value="Expiring Soon">Expiring Soon</option>
            </select>
          </label>
        </div>
      </div>

      <div class="applications-grid" *ngIf="filteredApplications.length > 0">
        <div class="application-card" *ngFor="let app of filteredApplications" 
             [class.high-priority]="app.priorityScore >= 80"
             [class.medium-priority]="app.priorityScore >= 50 && app.priorityScore < 80"
             (click)="navigateToDetail(app.id)">
          <div class="card-header">
            <h3>{{ app.providerName }}</h3>
            <span class="status-badge" [class]="'status-' + app.overallStatus.toLowerCase().replace(' ', '-')">
              {{ app.overallStatus }}
            </span>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">Application ID:</span>
              <span class="value">{{ app.id }}</span>
            </div>
            <div class="info-row">
              <span class="label">Submission Date:</span>
              <span class="value">{{ app.submissionDate | date:'short' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Priority Score:</span>
              <span class="value priority-score" [class.high]="app.priorityScore >= 80">
                {{ app.priorityScore }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">Risk Score:</span>
              <span class="value risk-score" [class.high]="app.riskScore >= 80">
                {{ app.riskScore }}
              </span>
            </div>
            <div class="payers-section">
              <span class="label">Payers ({{ app.payers.length }}):</span>
              <div class="payer-badges">
                <span class="payer-badge" *ngFor="let payer of app.payers" 
                      [class]="'payer-status-' + payer.status.toLowerCase().replace(' ', '-')">
                  {{ payer.payerName }}: {{ payer.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="no-data" *ngIf="filteredApplications.length === 0">
        <p>No applications found matching the current filters.</p>
      </div>
    </div>
  `,
  styles: [`
    .application-list-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .header-section h2 {
      margin: 0;
      color: #333;
    }
    .controls {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .controls label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }
    .controls select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    .applications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    .application-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border-left: 4px solid #1976d2;
    }
    .application-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .application-card.high-priority {
      border-left-color: #d32f2f;
    }
    .application-card.medium-priority {
      border-left-color: #f57c00;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .card-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
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
    .card-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-row .label {
      font-weight: 500;
      color: #666;
    }
    .info-row .value {
      color: #333;
    }
    .priority-score.high,
    .risk-score.high {
      color: #d32f2f;
      font-weight: 700;
    }
    .payers-section {
      margin-top: 0.5rem;
    }
    .payer-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .payer-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      background: #e3f2fd;
      color: #1976d2;
    }
    .payer-status-ready-to-submit {
      background: #e8f5e9;
      color: #4caf50;
    }
    .payer-status-incomplete {
      background: #fff3e0;
      color: #f57c00;
    }
    .payer-status-expiring-soon {
      background: #ffebee;
      color: #d32f2f;
    }
    .no-data {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      color: #666;
    }
  `]
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  sortBy: string = 'default';
  filterStatus: string = 'all';

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.applyFiltersAndSort();
      },
      error: (err) => console.error('Error loading applications:', err)
    });
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.applications];

    // Apply status filter
    if (this.filterStatus !== 'all') {
      result = result.filter(app => app.overallStatus === this.filterStatus);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'priority':
        result.sort((a, b) => b.priorityScore - a.priorityScore);
        break;
      case 'risk':
        result.sort((a, b) => b.riskScore - a.riskScore);
        break;
      case 'status':
        result.sort((a, b) => a.overallStatus.localeCompare(b.overallStatus));
        break;
    }

    this.filteredApplications = result;
  }

  navigateToDetail(id: string): void {
    window.location.href = `#/applications/${id}`;
  }
}