import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../services/application.service';
import { Application, ApplicationStatus, Document } from '../models/application.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="card">
      <a routerLink="/applications" class="btn btn-secondary">← Back to List</a>
      
      <div *ngIf="loading" class="loading">Loading application details...</div>

      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <div *ngIf="application && !loading">
        <h2>{{ application.providerName }} - {{ application.applicationType }}</h2>
        
        <div class="grid grid-2" style="margin: 20px 0;">
          <div>
            <strong>NPI:</strong> {{ application.providerNPI }}
          </div>
          <div>
            <strong>Coordinator:</strong> {{ application.coordinatorName }}
          </div>
          <div>
            <strong>Start Date:</strong> {{ application.startDate | date }}
          </div>
          <div>
            <strong>Overall Status:</strong>
            <span [class]="getStatusClass(application.overallStatus)">
              {{ application.overallStatus }}
            </span>
          </div>
        </div>

        <button class="btn btn-primary" (click)="evaluateApplication()" style="margin: 10px 0;">
          Re-evaluate Application
        </button>

        <div *ngIf="evaluating" class="alert alert-warning">Evaluating application...</div>
        <div *ngIf="evaluationSuccess" class="alert alert-success">Application evaluated successfully!</div>

        <h3>Payer Status Breakdown</h3>
        <div *ngFor="let payer of application.payerStatuses" class="card" style="margin: 10px 0;">
          <h4>{{ payer.payerName }}</h4>
          <p>
            <strong>Status:</strong>
            <span [class]="getStatusClass(payer.status)">{{ payer.status }}</span>
          </p>
          <p><strong>Rule Set Version:</strong> {{ payer.ruleSetVersion }}</p>
          
          <h5>Requirements:</h5>
          <table class="table">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Status</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let req of payer.requirements">
                <td>{{ req.requirementName }}</td>
                <td>
                  <span [class]="getStatusClass(req.status)">{{ req.status }}</span>
                </td>
                <td>{{ req.rationale }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Documents</h3>
        <div class="form-group">
          <label>Upload Document:</label>
          <input type="file" (change)="onFileSelected($event)" class="form-control">
          <button class="btn btn-primary" (click)="uploadDocument()" [disabled]="!selectedFile" style="margin-top: 10px;">
            Upload
          </button>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Type</th>
              <th>Upload Date</th>
              <th>Uploaded By</th>
              <th>Expiration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doc of application.documents">
              <td>{{ doc.name }}</td>
              <td>{{ doc.type }}</td>
              <td>{{ doc.uploadDate | date }}</td>
              <td>{{ doc.uploadedBy }}</td>
              <td>{{ doc.expirationDate ? (doc.expirationDate | date) : 'N/A' }}</td>
              <td>
                <span [class]="getDocumentStatusClass(doc.status)">{{ doc.status }}</span>
              </td>
              <td>
                <button class="btn btn-danger" (click)="deleteDocument(doc.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ApplicationDetailComponent implements OnInit {
  application: Application | null = null;
  loading = false;
  error = '';
  evaluating = false;
  evaluationSuccess = false;
  selectedFile: File | null = null;

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
      next: (app) => {
        this.application = app;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load application details';
        this.loading = false;
        console.error(err);
      }
    });
  }

  evaluateApplication(): void {
    if (!this.application) return;
    
    this.evaluating = true;
    this.evaluationSuccess = false;
    const startTime = Date.now();
    
    this.applicationService.evaluateApplication(this.application.id).subscribe({
      next: () => {
        const elapsed = Date.now() - startTime;
        console.log(`Evaluation completed in ${elapsed}ms`);
        this.evaluating = false;
        this.evaluationSuccess = true;
        this.loadApplication(this.application!.id);
        setTimeout(() => {
          this.evaluationSuccess = false;
        }, 3000);
      },
      error: (err) => {
        this.evaluating = false;
        console.error('Evaluation failed', err);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadDocument(): void {
    if (!this.application || !this.selectedFile) return;

    const metadata = {
      type: this.selectedFile.name.split('.').pop(),
      uploadedBy: 'Current User'
    };

    this.applicationService.uploadDocument(this.application.id, this.selectedFile, metadata).subscribe({
      next: () => {
        this.selectedFile = null;
        this.loadApplication(this.application!.id);
      },
      error: (err) => {
        console.error('Upload failed', err);
      }
    });
  }

  deleteDocument(documentId: string): void {
    if (!this.application) return;

    if (confirm('Are you sure you want to delete this document?')) {
      this.applicationService.deleteDocument(this.application.id, documentId).subscribe({
        next: () => {
          this.loadApplication(this.application!.id);
        },
        error: (err) => {
          console.error('Delete failed', err);
        }
      });
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

  getDocumentStatusClass(status: string): string {
    const baseClass = 'status-badge ';
    switch (status) {
      case 'Valid':
        return baseClass + 'status-ready';
      case 'Expired':
        return baseClass + 'status-incomplete';
      case 'Expiring Soon':
        return baseClass + 'status-expiring';
      default:
        return baseClass;
    }
  }
}