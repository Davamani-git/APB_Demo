import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RuleSetService } from '../services/rule-set.service';
import { RuleSet } from '../models/rule-set.model';

@Component({
  selector: 'app-rule-set-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="rule-set-list-container">
      <div class="header-section">
        <h2>Payer Rule Set Library</h2>
        <button class="create-button" (click)="createNewRuleSet()">+ Create New Rule Set</button>
      </div>

      <div class="filter-section">
        <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" 
               placeholder="Search by payer name or ID..." class="search-input">
        <label>
          Show:
          <select [(ngModel)]="filterActive" (change)="onFilterChange()">
            <option value="all">All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </label>
      </div>

      <div class="rule-sets-grid" *ngIf="filteredRuleSets.length > 0">
        <div class="rule-set-card" *ngFor="let ruleSet of filteredRuleSets" 
             (click)="navigateToDetail(ruleSet.id)">
          <div class="card-header">
            <h3>{{ ruleSet.payerName }}</h3>
            <span class="active-badge" [class.active]="ruleSet.isActive">
              {{ ruleSet.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">Payer ID:</span>
              <span class="value">{{ ruleSet.payerId }}</span>
            </div>
            <div class="info-row">
              <span class="label">Version:</span>
              <span class="value">{{ ruleSet.version }}</span>
            </div>
            <div class="info-row">
              <span class="label">Effective Date:</span>
              <span class="value">{{ ruleSet.effectiveDate | date:'short' }}</span>
            </div>
            <div class="info-row" *ngIf="ruleSet.endDate">
              <span class="label">End Date:</span>
              <span class="value">{{ ruleSet.endDate | date:'short' }}</span>
            </div>
            <div class="counts-section">
              <span class="count-badge">{{ ruleSet.requiredDocuments.length }} Documents</span>
              <span class="count-badge">{{ ruleSet.requiredDataFields.length }} Data Fields</span>
            </div>
          </div>
        </div>
      </div>

      <div class="no-data" *ngIf="filteredRuleSets.length === 0">
        <p>No rule sets found matching the current filters.</p>
      </div>
    </div>
  `,
  styles: [`
    .rule-set-list-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .header-section h2 {
      margin: 0;
      color: #333;
    }
    .create-button {
      background: #4caf50;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
    }
    .create-button:hover {
      background: #45a049;
    }
    .filter-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .search-input {
      flex: 1;
      min-width: 300px;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .filter-section label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }
    .filter-section select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    .rule-sets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .rule-set-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border-left: 4px solid #1976d2;
    }
    .rule-set-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .card-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }
    .active-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #e0e0e0;
      color: #666;
    }
    .active-badge.active {
      background: #4caf50;
      color: white;
    }
    .card-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-row .label {
      font-weight: 500;
      color: #666;
    }
    .info-row .value {
      color: #333;
    }
    .counts-section {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .count-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      background: #e3f2fd;
      color: #1976d2;
    }
    .no-data {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      color: #666;
    }
  `]
})
export class RuleSetListComponent implements OnInit {
  ruleSets: RuleSet[] = [];
  filteredRuleSets: RuleSet[] = [];
  searchTerm: string = '';
  filterActive: string = 'all';

  constructor(private ruleSetService: RuleSetService) {}

  ngOnInit(): void {
    this.loadRuleSets();
  }

  loadRuleSets(): void {
    this.ruleSetService.getRuleSets().subscribe({
      next: (data) => {
        this.ruleSets = data;
        this.applyFilters();
      },
      error: (err) => console.error('Error loading rule sets:', err)
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.ruleSets];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(rs => 
        rs.payerName.toLowerCase().includes(term) || 
        rs.payerId.toLowerCase().includes(term)
      );
    }

    // Apply active filter
    if (this.filterActive === 'active') {
      result = result.filter(rs => rs.isActive);
    } else if (this.filterActive === 'inactive') {
      result = result.filter(rs => !rs.isActive);
    }

    this.filteredRuleSets = result;
  }

  navigateToDetail(id: string): void {
    window.location.href = `#/rule-sets/${id}`;
  }

  createNewRuleSet(): void {
    alert('Create new rule set functionality - to be implemented');
  }
}