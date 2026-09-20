import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicationService } from '../services/application.service';
import { Application, PayerStatus, Requirement } from '../models/application.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="application-detail-container" *ngIf="application">
      <div class="header-section">
        <button class="back-button" routerLink="/applications">← Back to Applications</button>
        <h2>Application Details: {{ application.providerName }}</h2>
      </div>

      <div class="summary-card">
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Application ID:</span>
            <span class="value">{{ application.id }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Provider Name:</span>
            <span class="value">{{ application.providerName }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Submission Date:</span>
            <span class="value">{{ application.submissionDate | date:'medium' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Overall Status:</span>
            <span class="status-badge" [class]="'status-' + application.overallStatus.toLowerCase().replace(' ', '-')">
              {{ application.overallStatus }}
            </span>
          </div>
          <div class="summary-item">
            <span class="label">Priority Score:</span>
            <span class="value" [class.high-score]="application.priorityScore >= 80">
              {{ application.priorityScore }}
            </span>
          </div>
          <div class="summary-item">
            <span class="label">Risk Score:</span>
            <span class="value" [class.high-score]="application.riskScore >= 80">
              {{ application.riskScore }}
            </span>
          </div>
        </div>
      </div>

      <div class="payers-section">
        <h3>Payer-Specific Status</h3>
        <div class="payer-cards">
          <div class="payer-card" *ngFor="let payer of application.payers">
            <div class="payer-header">
              <h4>{{ payer.payerName }}</h4>
              <span class="status-badge" [class]="'status-' + payer.status.toLowerCase().replace(' ', '-')">
                {{ payer.status }}
              </span>
            </div>
            <div class="payer-info">
              <div class="info-item">
                <span class="label">Payer ID:</span>
                <span class="value">{{ payer.payerId }}</span>
              </div>
              <div class="info-item">
                <span class="label">Rule Set Version:</span>
                <span class="value">{{ payer.ruleSetVersion }}</span>
              </div>
            </div>
            <div class="requirements-section">
              <h5>Requirements</h5>
              <div class="requirements-list">
                <div class="requirement-item" *ngFor="let req of payer.requirements"
                     [class]="'req-' + req.status.toLowerCase().replace(' ', '-')">
                  <div class="req-header">
                    <span class="req-name">{{ req.name }}</span>
                    <span class="req-status">{{ req.status }}</span>
                  </div>
                  <div class="req-details">
                    <div *ngIf="req.expirationDate">
                      <strong>Expires:</strong> {{ req.expirationDate | date:'short' }}
                    </div>
                    <div *ngIf="req.recommendation" class="recommendation">
                      <strong>Recommendation:</strong> {{ req.recommendation }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!application">
      <p>Loading application details...</p>
    </div>
  `,
  styles: [`
    .application-detail-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .header-section {
      margin-bottom: 2rem;
    }
    .back-button {
      background: #1976d2;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    .back-button:hover {
      background: #1565c0;
    }
    .header-section h2 {
      margin: 0;
      color: #333;
    }
    .summary-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .summary-item .label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }
    .summary-item .value {
      font-size: 1.1rem;
      color: #333;
    }
    .high-score {
      color: #d32f2f;
      font-weight: 700;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-block;
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
    .payers-section h3 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    .payer-cards {
      display: grid;
      gap: 1.5rem;
    }
    .payer-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .payer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eee;
    }
    .payer-header h4 {
      margin: 0;
      color: #333;
    }
    .payer-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .info-item .label {
      font-weight: 600;
      color: #666;
      font-size: 0.85rem;
    }
    .info-item .value {
      color: #333;
    }
    .requirements-section h5 {
      margin-bottom: 1rem;
      color: #333;
    }
    .requirements-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .requirement-item {
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid #1976d2;
      background: #f9f9f9;
    }
    .requirement-item.req-present-and-valid {
      border-left-color: #4caf50;
      background: #f1f8f4;
    }
    .requirement-item.req-missing {
      border-left-color: #ff9800;
      background: #fff8f0;
    }
    .requirement-item.req-expired,
    .requirement-item.req-expiring-soon {
      border-left-color: #f44336;
      background: #fff5f5;
    }
    .req-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .req-name {
      font-weight: 600;
      color: #333;
    }
    .req-status {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: #e0e0e0;
      color: #333;
    }
    .req-details {
      font-size: 0.9rem;
      color: #666;
    }
    .recommendation {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #fff3cd;
      border-radius: 4px;
      color: #856404;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class ApplicationDetailComponent implements OnInit {
  application: Application | null = null;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(id);
    }
  }

  loadApplication(id: string): void {
    this.applicationService.getApplicationById(id).subscribe({
      next: (data) => {
        this.application = data;
      },
      error: (err) => console.error('Error loading application:', err)
    });
  }
}