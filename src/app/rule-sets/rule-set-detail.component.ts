import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RuleSetService } from '../services/rule-set.service';
import { RuleSet } from '../models/rule-set.model';

@Component({
  selector: 'app-rule-set-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="rule-set-detail-container" *ngIf="ruleSet">
      <div class="header-section">
        <button class="back-button" routerLink="/rule-sets">← Back to Rule Sets</button>
        <h2>Rule Set Details: {{ ruleSet.payerName }}</h2>
      </div>

      <div class="summary-card">
        <div class="summary-header">
          <h3>General Information</h3>
          <button class="edit-button" (click)="editRuleSet()">Edit</button>
        </div>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Payer ID:</span>
            <span class="value">{{ ruleSet.payerId }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Payer Name:</span>
            <span class="value">{{ ruleSet.payerName }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Version:</span>
            <span class="value">{{ ruleSet.version }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Status:</span>
            <span class="active-badge" [class.active]="ruleSet.isActive">
              {{ ruleSet.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="summary-item">
            <span class="label">Effective Date:</span>
            <span class="value">{{ ruleSet.effectiveDate | date:'medium' }}</span>
          </div>
          <div class="summary-item" *ngIf="ruleSet.endDate">
            <span class="label">End Date:</span>
            <span class="value">{{ ruleSet.endDate | date:'medium' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Created By:</span>
            <span class="value">{{ ruleSet.createdBy }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Last Modified:</span>
            <span class="value">{{ ruleSet.lastModified | date:'medium' }}</span>
          </div>
        </div>
      </div>

      <div class="documents-section">
        <h3>Required Documents ({{ ruleSet.requiredDocuments.length }})</h3>
        <div class="documents-list">
          <div class="document-item" *ngFor="let doc of ruleSet.requiredDocuments">
            <div class="doc-header">
              <span class="doc-name">{{ doc.documentType }}</span>
              <span class="required-badge" *ngIf="doc.isMandatory">Mandatory</span>
            </div>
            <div class="doc-details" *ngIf="doc.description">
              {{ doc.description }}
            </div>
            <div class="doc-meta" *ngIf="doc.expirationRequired">
              <span class="meta-label">Expiration tracking required</span>
            </div>
          </div>
        </div>
      </div>

      <div class="fields-section">
        <h3>Required Data Fields ({{ ruleSet.requiredDataFields.length }})</h3>
        <div class="fields-list">
          <div class="field-item" *ngFor="let field of ruleSet.requiredDataFields">
            <div class="field-header">
              <span class="field-name">{{ field.fieldName }}</span>
              <span class="required-badge" *ngIf="field.isMandatory">Mandatory</span>
            </div>
            <div class="field-details">
              <div class="field-meta">
                <span><strong>Type:</strong> {{ field.fieldType }}</span>
                <span *ngIf="field.validationRule"><strong>Validation:</strong> {{ field.validationRule }}</span>
              </div>
              <div *ngIf="field.description" class="field-description">
                {{ field.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!ruleSet">
      <p>Loading rule set details...</p>
    </div>
  `,
  styles: [`
    .rule-set-detail-container {
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
    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .summary-header h3 {
      margin: 0;
      color: #333;
    }
    .edit-button {
      background: #1976d2;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .edit-button:hover {
      background: #1565c0;
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
    .active-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #e0e0e0;
      color: #666;
      display: inline-block;
    }
    .active-badge.active {
      background: #4caf50;
      color: white;
    }
    .documents-section,
    .fields-section {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .documents-section h3,
    .fields-section h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }
    .documents-list,
    .fields-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .document-item,
    .field-item {
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid #1976d2;
      background: #f9f9f9;
    }
    .doc-header,
    .field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .doc-name,
    .field-name {
      font-weight: 600;
      color: #333;
      font-size: 1rem;
    }
    .required-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #ff9800;
      color: white;
    }
    .doc-details,
    .field-description {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.5rem;
    }
    .doc-meta {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #1976d2;
    }
    .field-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class RuleSetDetailComponent implements OnInit {
  ruleSet: RuleSet | null = null;

  constructor(
    private route: ActivatedRoute,
    private ruleSetService: RuleSetService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRuleSet(id);
    }
  }

  loadRuleSet(id: string): void {
    this.ruleSetService.getRuleSetById(id).subscribe({
      next: (data) => {
        this.ruleSet = data;
      },
      error: (err) => console.error('Error loading rule set:', err)
    });
  }

  editRuleSet(): void {
    alert('Edit rule set functionality - to be implemented');
  }
}