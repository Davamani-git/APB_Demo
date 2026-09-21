import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PayerRuleService } from '../services/payer-rule.service.js';
import { PayerRule } from '../models/payer-rule.model.js';

@Component({
  selector: 'app-payer-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Payer Rule Library</h2>
      
      <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
        {{showAddForm ? 'Cancel' : 'Add New Rule Set'}}
      </button>
      
      <div *ngIf="showAddForm" class="card" style="margin-top: 20px;">
        <h3>Create New Payer Rule Set</h3>
        <form [formGroup]="ruleForm" (ngSubmit)="createRule()">
          <div class="form-group">
            <label>Payer Name *</label>
            <input type="text" class="form-control" formControlName="payerName" required>
          </div>
          
          <div class="form-group">
            <label>Version *</label>
            <input type="text" class="form-control" formControlName="version" required>
          </div>
          
          <div class="form-group">
            <label>Effective Date *</label>
            <input type="date" class="form-control" formControlName="effectiveDate" required>
          </div>
          
          <div class="form-group">
            <label>End Date</label>
            <input type="date" class="form-control" formControlName="endDate">
          </div>
          
          <div class="form-group">
            <label>Expiration Threshold (days)</label>
            <input type="number" class="form-control" formControlName="expirationThreshold" required>
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="!ruleForm.valid">Create Rule Set</button>
        </form>
      </div>
      
      <div *ngIf="loading" class="loading">Loading payer rules...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      <div *ngIf="success" class="success">{{success}}</div>
      
      <table *ngIf="!loading && rules.length > 0" style="margin-top: 20px;">
        <thead>
          <tr>
            <th>Payer Name</th>
            <th>Version</th>
            <th>Effective Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let rule of rules">
            <td>{{rule.payerName}}</td>
            <td>{{rule.version}}</td>
            <td>{{rule.effectiveDate | date}}</td>
            <td>{{rule.endDate ? (rule.endDate | date) : 'Current'}}</td>
            <td>
              <span class="status-badge" [ngClass]="rule.isActive ? 'status-ready' : 'status-incomplete'">
                {{rule.isActive ? 'Active' : 'Inactive'}}
              </span>
            </td>
            <td>
              <a [routerLink]="['/payer-rules', rule.id]" class="btn btn-primary">View Details</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class PayerRulesComponent implements OnInit {
  rules: PayerRule[] = [];
  showAddForm: boolean = false;
  ruleForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private payerRuleService: PayerRuleService,
    private fb: FormBuilder
  ) {
    this.ruleForm = this.fb.group({
      payerName: ['', Validators.required],
      version: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      endDate: [''],
      expirationThreshold: [90, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.loading = true;
    this.error = '';
    
    this.payerRuleService.getPayerRules().subscribe({
      next: (data) => {
        this.rules = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payer rules';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createRule(): void {
    if (this.ruleForm.valid) {
      const newRule: Partial<PayerRule> = {
        ...this.ruleForm.value,
        isActive: true,
        requiredDocuments: [],
        requiredDataFields: []
      };
      
      this.payerRuleService.createPayerRule(newRule as PayerRule).subscribe({
        next: (data) => {
          this.success = 'Payer rule created successfully';
          this.showAddForm = false;
          this.ruleForm.reset();
          this.loadRules();
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          this.error = 'Failed to create payer rule';
          console.error(err);
        }
      });
    }
  }
}