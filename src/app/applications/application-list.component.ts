import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../services/application.service.js';
import { Application, ApplicationStatus } from '../models/application.model.js';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Enrollment Applications</h2>
      
      <div class="filter-bar">
        <div class="form-group">
          <label>Status</label>
          <select class="form-control" [(ngModel)]="filterStatus" (change)="applyFilters()">
            <option value="">All Statuses</option>
            <option value="Ready to Submit">Ready to Submit</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Expiring Soon">Expiring Soon</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Coordinator</label>
          <select class="form-control" [(ngModel)]="filterCoordinator" (change)="applyFilters()">
            <option value="">All Coordinators</option>
            <option *ngFor="let coord of coordinators" [value]="coord">{{coord}}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Payer</label>
          <select class="form-control" [(ngModel)]="filterPayer" (change)="applyFilters()">
            <option value="">All Payers</option>
            <option *ngFor="let payer of payers" [value]="payer">{{payer}}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Sort By</label>
          <select class="form-control" [(ngModel)]="sortBy" (change)="applyFilters()">
            <option value="priority">Priority Score</option>
            <option value="name">Provider Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">Loading applications...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      
      <div *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>Provider Name</th>
              <th>Application ID</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Coordinator</th>
              <th>Target Payers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of filteredApplications">
              <td>{{app.providerName}}</td>
              <td>{{app.applicationId}}</td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(app.overallStatus)">
                  {{app.overallStatus}}
                </span>
              </td>
              <td>
                <span [ngClass]="getPriorityClass(app.priorityScore)">
                  {{app.priorityScore}}
                </span>
              </td>
              <td>{{app.coordinator}}</td>
              <td>{{app.targetPayers.join(', ')}}</td>
              <td>
                <a [routerLink]="['/applications', app.id]" class="btn btn-primary">View Details</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="!loading && !error && filteredApplications.length === 0" class="loading">
        No applications found matching the selected filters.
      </div>
    </div>
  `,
  styles: []
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  coordinators: string[] = [];
  payers: string[] = [];
  
  filterStatus: string = '';
  filterCoordinator: string = '';
  filterPayer: string = '';
  sortBy: string = 'priority';
  
  loading: boolean = false;
  error: string = '';

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.error = '';
    
    this.applicationService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.extractFilters();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load applications';
        this.loading = false;
        console.error(err);
      }
    });
  }

  extractFilters(): void {
    const coordSet = new Set<string>();
    const payerSet = new Set<string>();
    
    this.applications.forEach(app => {
      coordSet.add(app.coordinator);
      app.targetPayers.forEach(payer => payerSet.add(payer));
    });
    
    this.coordinators = Array.from(coordSet).sort();
    this.payers = Array.from(payerSet).sort();
  }

  applyFilters(): void {
    let filtered = [...this.applications];
    
    if (this.filterStatus) {
      filtered = filtered.filter(app => app.overallStatus === this.filterStatus);
    }
    
    if (this.filterCoordinator) {
      filtered = filtered.filter(app => app.coordinator === this.filterCoordinator);
    }
    
    if (this.filterPayer) {
      filtered = filtered.filter(app => app.targetPayers.includes(this.filterPayer));
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'priority':
          return b.priorityScore - a.priorityScore;
        case 'name':
          return a.providerName.localeCompare(b.providerName);
        case 'status':
          return a.overallStatus.localeCompare(b.overallStatus);
        default:
          return 0;
      }
    });
    
    this.filteredApplications = filtered;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready to Submit':
        return 'status-ready';
      case 'Incomplete':
        return 'status-incomplete';
      case 'Expiring Soon':
        return 'status-expiring';
      default:
        return '';
    }
  }

  getPriorityClass(score: number): string {
    if (score >= 80) return 'priority-high';
    if (score >= 50) return 'priority-medium';
    return 'priority-low';
  }
}