import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../services/dashboard.service.js';
import { DashboardStats, DrillDownData } from '../models/dashboard.model.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Enrollment Manager Dashboard</h2>
      
      <div *ngIf="loading" class="loading">Loading dashboard...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      
      <div *ngIf="stats && !loading">
        <div class="dashboard-grid">
          <div class="dashboard-card" (click)="drillDown('Ready to Submit')">
            <h3>Ready to Submit</h3>
            <div class="count">{{stats.readyToSubmit}}</div>
          </div>
          
          <div class="dashboard-card" (click)="drillDown('Incomplete')">
            <h3>Incomplete</h3>
            <div class="count">{{stats.incomplete}}</div>
          </div>
          
          <div class="dashboard-card" (click)="drillDown('Expiring Soon')">
            <h3>Expiring Soon</h3>
            <div class="count">{{stats.expiringSoon}}</div>
          </div>
          
          <div class="dashboard-card">
            <h3>Total Applications</h3>
            <div class="count">{{stats.total}}</div>
          </div>
        </div>
        
        <div *ngIf="selectedStatus" class="card">
          <h3>Drill-Down: {{selectedStatus}}</h3>
          <div class="form-group">
            <label>Group By</label>
            <select class="form-control" [(ngModel)]="groupBy" (change)="loadDrillDown()">
              <option value="coordinator">Coordinator</option>
              <option value="payer">Payer</option>
            </select>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>{{groupBy === 'coordinator' ? 'Coordinator' : 'Payer'}}</th>
                <th>Count</th>
                <th>Applications</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of drillDownData">
                <td>{{item.groupName}}</td>
                <td>{{item.count}}</td>
                <td>
                  <span *ngFor="let appId of item.applicationIds; let last = last">
                    {{appId}}{{last ? '' : ', '}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  drillDownData: DrillDownData[] = [];
  selectedStatus: string = '';
  groupBy: string = 'coordinator';
  loading: boolean = false;
  error: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = '';
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
        console.error(err);
      }
    });
  }

  drillDown(status: string): void {
    this.selectedStatus = status;
    this.loadDrillDown();
  }

  loadDrillDown(): void {
    if (!this.selectedStatus) return;
    
    this.dashboardService.getDrillDownData(this.selectedStatus, this.groupBy).subscribe({
      next: (data) => {
        this.drillDownData = data;
      },
      error: (err) => {
        this.error = 'Failed to load drill-down data';
        console.error(err);
      }
    });
  }
}