import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationService } from '../services/application.service.js';
import { Application, PayerRequirement } from '../models/application.model.js';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <a routerLink="/applications" class="btn btn-secondary">← Back to List</a>
      
      <div *ngIf="loading" class="loading">Loading application details...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      
      <div *ngIf="application && !loading">
        <h2>{{application.providerName}}</h2>
        <p><strong>Application ID:</strong> {{application.applicationId}}</p>
        <p><strong>Coordinator:</strong> {{application.coordinator}}</p>
        <p><strong>Submission Date:</strong> {{application.submissionDate | date}}</p>
        <p><strong>Overall Status:</strong> 
          <span class="status-badge" [ngClass]="getStatusClass(application.overallStatus)">
            {{application.overallStatus}}
          </span>
        </p>
        <p><strong>Priority Score:</strong> 
          <span [ngClass]="getPriorityClass(application.priorityScore)">
            {{application.priorityScore}}
          </span>
        </p>
        
        <h3>Payer-Specific Requirements</h3>
        
        <div *ngFor="let payerReq of application.payerRequirements" class="payer-section">
          <h3>
            {{payerReq.payerName}}
            <span class="status-badge" [ngClass]="getStatusClass(payerReq.status)">{{payerReq.status}}</span>
          </h3>
          
          <h4>Required Documents</h4>
          <ul class="requirement-list">
            <li *ngFor="let doc of payerReq.documents" 
                class="requirement-item" 
                [ngClass]="getRequirementClass(doc.status)">
              <strong>{{doc.name}}</strong>: {{doc.status}}
              <div *ngIf="doc.expirationDate">
                <small>Expires: {{doc.expirationDate | date}}</small>
              </div>
              <div *ngIf="doc.recommendation" class="error">
                {{doc.recommendation}}
              </div>
            </li>
          </ul>
          
          <h4>Required Data Fields</h4>
          <ul class="requirement-list">
            <li *ngFor="let field of payerReq.dataFields" 
                class="requirement-item" 
                [ngClass]="getRequirementClass(field.status)">
              <strong>{{field.name}}</strong>: {{field.status}}
              <div *ngIf="field.value">
                <small>Value: {{field.value}}</small>
              </div>
              <div *ngIf="field.recommendation" class="error">
                {{field.recommendation}}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ApplicationDetailComponent implements OnInit {
  application: Application | null = null;
  loading: boolean = false;
  error: string = '';

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
    this.loading = true;
    this.error = '';
    
    this.applicationService.getApplicationById(id).subscribe({
      next: (data) => {
        this.application = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load application details';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready to Submit':
      case 'Present & Valid':
        return 'status-ready';
      case 'Incomplete':
      case 'Missing':
        return 'status-incomplete';
      case 'Expiring Soon':
      case 'Expired':
        return 'status-expiring';
      default:
        return '';
    }
  }

  getRequirementClass(status: string): string {
    switch (status) {
      case 'Present & Valid':
        return 'present';
      case 'Missing':
        return 'missing';
      case 'Expired':
      case 'Expiring Soon':
        return 'expiring';
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