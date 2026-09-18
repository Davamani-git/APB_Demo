import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RuleService } from '../services/rule.service';
import { PayerRuleSet, Requirement } from '../models/rule.model';

@Component({
  selector: 'app-rule-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="card">
      <a routerLink="/admin" class="btn btn-secondary">← Back to Admin</a>
      
      <h2>Payer Rule Set Management</h2>
      
      <button class="btn btn-primary" (click)="showCreateForm = true" style="margin: 10px 0;">
        Create New Rule Set
      </button>

      <div *ngIf="showCreateForm" class="modal-overlay" (click)="showCreateForm = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingRuleSet ? 'Edit Rule Set' : 'Create New Rule Set' }}</h3>
            <button class="close-btn" (click)="showCreateForm = false">×</button>
          </div>
          <form (ngSubmit)="saveRuleSet()">
            <div class="form-group">
              <label>Payer ID:</label>
              <input type="text" [(ngModel)]="currentRuleSet.payerId" name="payerId" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Payer Name:</label>
              <input type="text" [(ngModel)]="currentRuleSet.payerName" name="payerName" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Version:</label>
              <input type="text" [(ngModel)]="currentRuleSet.version" name="version" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Effective Date:</label>
              <input type="date" [(ngModel)]="currentRuleSet.effectiveDate" name="effectiveDate" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Active:</label>
              <input type="checkbox" [(ngModel)]="currentRuleSet.isActive" name="isActive">
            </div>
            <button type="submit" class="btn btn-primary">Save Rule Set</button>
          </form>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Loading rule sets...</div>

      <table class="table" *ngIf="!loading && ruleSets.length > 0">
        <thead>
          <tr>
            <th>Payer Name</th>
            <th>Version</th>
            <th>Effective Date</th>
            <th>Created By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ruleSet of ruleSets">
            <td>{{ ruleSet.payerName }}</td>
            <td>{{ ruleSet.version }}</td>
            <td>{{ ruleSet.effectiveDate | date }}</td>
            <td>{{ ruleSet.createdBy }}</td>
            <td>
              <span [class]="ruleSet.isActive ? 'status-badge status-ready' : 'status-badge status-incomplete'">
                {{ ruleSet.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button class="btn btn-primary" (click)="editRuleSet(ruleSet)" style="margin-right: 5px;">
                Edit
              </button>
              <button class="btn btn-secondary" (click)="viewVersions(ruleSet.payerId)" style="margin-right: 5px;">
                Versions
              </button>
              <button class="btn btn-danger" (click)="deactivateRuleSet(ruleSet.id)" *ngIf="ruleSet.isActive">
                Deactivate
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="showVersions" class="card" style="margin-top: 20px;">
        <h3>Version History for {{ selectedPayerId }}</h3>
        <button class="btn btn-secondary" (click)="showVersions = false">Close</button>
        <table class="table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Effective Date</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let version of versions">
              <td>{{ version.version }}</td>
              <td>{{ version.effectiveDate | date }}</td>
              <td>{{ version.createdAt | date:'short' }}</td>
              <td>{{ version.createdBy }}</td>
              <td>
                <span [class]="version.isActive ? 'status-badge status-ready' : 'status-badge status-incomplete'">
                  {{ version.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RuleManagementComponent implements OnInit {
  ruleSets: PayerRuleSet[] = [];
  versions: PayerRuleSet[] = [];
  loading = false;
  showCreateForm = false;
  showVersions = false;
  editingRuleSet = false;
  selectedPayerId = '';
  currentRuleSet: Partial<PayerRuleSet> = {
    payerId: '',
    payerName: '',
    version: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    isActive: true,
    requirements: []
  };

  constructor(private ruleService: RuleService) {}

  ngOnInit(): void {
    this.loadRuleSets();
  }

  loadRuleSets(): void {
    this.loading = true;
    this.ruleService.loadRuleSets().subscribe({
      next: (ruleSets) => {
        this.ruleSets = ruleSets;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load rule sets', err);
        this.loading = false;
      }
    });
  }

  saveRuleSet(): void {
    const ruleSetData = {
      ...this.currentRuleSet,
      createdBy: 'Current Admin',
      createdAt: new Date().toISOString()
    };

    if (this.editingRuleSet && this.currentRuleSet.id) {
      this.ruleService.updateRuleSet(this.currentRuleSet.id, ruleSetData).subscribe({
        next: () => {
          this.showCreateForm = false;
          this.editingRuleSet = false;
          this.resetForm();
          this.loadRuleSets();
        },
        error: (err) => {
          console.error('Failed to update rule set', err);
        }
      });
    } else {
      this.ruleService.createRuleSet(ruleSetData).subscribe({
        next: () => {
          this.showCreateForm = false;
          this.resetForm();
          this.loadRuleSets();
        },
        error: (err) => {
          console.error('Failed to create rule set', err);
        }
      });
    }
  }

  editRuleSet(ruleSet: PayerRuleSet): void {
    this.currentRuleSet = { ...ruleSet };
    this.editingRuleSet = true;
    this.showCreateForm = true;
  }

  deactivateRuleSet(id: string): void {
    if (confirm('Are you sure you want to deactivate this rule set?')) {
      this.ruleService.deactivateRuleSet(id).subscribe({
        next: () => {
          this.loadRuleSets();
        },
        error: (err) => {
          console.error('Failed to deactivate rule set', err);
        }
      });
    }
  }

  viewVersions(payerId: string): void {
    this.selectedPayerId = payerId;
    this.ruleService.getRuleSetVersions(payerId).subscribe({
      next: (versions) => {
        this.versions = versions;
        this.showVersions = true;
      },
      error: (err) => {
        console.error('Failed to load versions', err);
      }
    });
  }

  resetForm(): void {
    this.currentRuleSet = {
      payerId: '',
      payerName: '',
      version: '1.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      isActive: true,
      requirements: []
    };
  }
}