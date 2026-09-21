import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PayerRuleService } from '../services/payer-rule.service.js';
import { PayerRule } from '../models/payer-rule.model.js';

@Component({
  selector: 'app-payer-rule-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="card">
      <a routerLink="/payer-rules" class="btn btn-secondary">← Back to Rules</a>
      
      <div *ngIf="loading" class="loading">Loading rule details...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      <div *ngIf="success" class="success">{{success}}</div>
      
      <div *ngIf="rule && !loading">
        <h2>{{rule.payerName}} - Version {{rule.version}}</h2>
        <p><strong>Effective Date:</strong> {{rule.effectiveDate | date}}</p>
        <p><strong>End Date:</strong> {{rule.endDate ? (rule.endDate | date) : 'Current'}}</p>
        <p><strong>Expiration Threshold:</strong> {{rule.expirationThreshold}} days</p>
        <p><strong>Status:</strong> 
          <span class="status-badge" [ngClass]="rule.isActive ? 'status-ready' : 'status-incomplete'">
            {{rule.isActive ? 'Active' : 'Inactive'}}
          </span>
        </p>
        
        <h3>Required Documents</h3>
        <div *ngIf="!editingDocuments">
          <button class="btn btn-primary" (click)="editingDocuments = true">Edit Documents</button>
          <ul class="requirement-list">
            <li *ngFor="let doc of rule.requiredDocuments" class="requirement-item present">
              {{doc}}
            </li>
          </ul>
        </div>
        
        <div *ngIf="editingDocuments">
          <div class="form-group">
            <label>Add Document (one per line)</label>
            <textarea class="form-control" [(ngModel)]="newDocuments" rows="5"></textarea>
          </div>
          <button class="btn btn-primary" (click)="saveDocuments()">Save</button>
          <button class="btn btn-secondary" (click)="editingDocuments = false; newDocuments = ''">Cancel</button>
        </div>
        
        <h3>Required Data Fields</h3>
        <div *ngIf="!editingFields">
          <button class="btn btn-primary" (click)="editingFields = true">Edit Fields</button>
          <ul class="requirement-list">
            <li *ngFor="let field of rule.requiredDataFields" class="requirement-item present">
              {{field}}
            </li>
          </ul>
        </div>
        
        <div *ngIf="editingFields">
          <div class="form-group">
            <label>Add Data Fields (one per line)</label>
            <textarea class="form-control" [(ngModel)]="newFields" rows="5"></textarea>
          </div>
          <button class="btn btn-primary" (click)="saveFields()">Save</button>
          <button class="btn btn-secondary" (click)="editingFields = false; newFields = ''">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PayerRuleDetailComponent implements OnInit {
  rule: PayerRule | null = null;
  editingDocuments: boolean = false;
  editingFields: boolean = false;
  newDocuments: string = '';
  newFields: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private route: ActivatedRoute,
    private payerRuleService: PayerRuleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRule(id);
    }
  }

  loadRule(id: string): void {
    this.loading = true;
    this.error = '';
    
    this.payerRuleService.getPayerRuleById(id).subscribe({
      next: (data) => {
        this.rule = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payer rule details';
        this.loading = false;
        console.error(err);
      }
    });
  }

  saveDocuments(): void {
    if (!this.rule) return;
    
    const docs = this.newDocuments.split('\n').filter(d => d.trim()).map(d => d.trim());
    const updatedRule = {
      ...this.rule,
      requiredDocuments: [...this.rule.requiredDocuments, ...docs]
    };
    
    this.payerRuleService.updatePayerRule(updatedRule).subscribe({
      next: (data) => {
        this.rule = data;
        this.editingDocuments = false;
        this.newDocuments = '';
        this.success = 'Documents updated successfully';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Failed to update documents';
        console.error(err);
      }
    });
  }

  saveFields(): void {
    if (!this.rule) return;
    
    const fields = this.newFields.split('\n').filter(f => f.trim()).map(f => f.trim());
    const updatedRule = {
      ...this.rule,
      requiredDataFields: [...this.rule.requiredDataFields, ...fields]
    };
    
    this.payerRuleService.updatePayerRule(updatedRule).subscribe({
      next: (data) => {
        this.rule = data;
        this.editingFields = false;
        this.newFields = '';
        this.success = 'Data fields updated successfully';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Failed to update data fields';
        console.error(err);
      }
    });
  }
}