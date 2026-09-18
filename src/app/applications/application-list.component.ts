import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../services/application.service';
import { Application, ApplicationStatus } from '../models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="card">
      <h2>Provider Enrollment Applications</h2>
      
      <div class="form-group">
        <label>Filter by Status:</label>
        <select [(ngModel)]="filterStatus" (change)="applyFilter()" class="form-control">
          <option value="">All Statuses</option>
          <option value="Ready to Submit">Ready to Submit</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Expiring Soon">Expiring Soon</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading">Loading applications...</div>

      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <table class="table" *ngIf="!loading && filteredApplications.length > 0">
        <thead>
          <tr>
            <th>Provider Name</th>
            <th>NPI</th>
            <th>Type</th>
            <th>Coordinator</th>
            <th>Overall Status</th>
            <th>Payer Statuses</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let app of filteredApplications" [routerLink]="['/applications', app.id]">
            <td>{{ app.providerName }}</td>
            <td>{{ app.providerNPI }}</td>
            <td>{{ app.applicationType }}</td>
            <td>{{ app.coordinatorName }}</td>
            <td>
              <span [class]="getStatusClass(app.overallStatus)">
                {{ app.overallStatus }}
              </span>
            </td>
            <td>
              <div *ngFor="let payer of app.payerStatuses" style="margin-bottom: 5px;">
                <strong>{{ payer.payerName }}:</strong>
                <span [class]="getStatusClass(payer.status)">
                  {{ payer.status }}
                </span>
              </div>
            </td>
            <td>{{ app.startDate | date }}</td>
            <td>
              <button class="btn btn-primary" (click)="evaluateApplication($event, app.id)">
                Evaluate
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && filteredApplications.length === 0" class="alert alert-warning">
        No applications found.
      </div>
    </div>
  `
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  loading = false;
  error = '';
  filterStatus = '';

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.error = '';
    this.applicationService.loadApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load applications';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilter(): void {
    if (this.filterStatus) {
      this.filteredApplications = this.applications.filter(
        app => app.overallStatus === this.filterStatus
      );
    } else {
      this.filteredApplications = [...this.applications];
    }
  }

  getStatusClass(status: ApplicationStatus): string {
    const baseClass = 'status-badge ';
    switch (status) {
      case 'Ready to Submit':
        return baseClass + 'status-ready';
      case 'Incomplete':
        return baseClass + 'status-incomplete';
      case 'Expiring Soon':
        return baseClass + 'status-expiring';
      default:
        return baseClass;
    }
  }

  evaluateApplication(event: Event, applicationId: string): void {
    event.stopPropagation();
    this.applicationService.evaluateApplication(applicationId).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (err) => {
        console.error('Evaluation failed', err);
      }
    });
  }
}