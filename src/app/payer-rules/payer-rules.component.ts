import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayerRuleService } from '../services/payer-rule.service';

interface PayerRule {
  id: string;
  payerId: string;
  payerName: string;
  version: string;
  effectiveDate: string;
  endDate?: string;
  requiredDocuments: RequiredDocument[];
  requiredDataFields: RequiredDataField[];
  expirationThresholdDays: number;
}

interface RequiredDocument {
  documentType: string;
  documentName: string;
  requiresExpiration: boolean;
}

interface RequiredDataField {
  fieldName: string;
  fieldLabel: string;
  dataType: string;
  mandatory: boolean;
}

@Component({
  selector: 'app-payer-rules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payer-rules.component.html',
  styleUrls: ['./payer-rules.component.css']
})
export class PayerRulesComponent implements OnInit {
  payerRules: PayerRule[] = [];
  filteredRules: PayerRule[] = [];
  selectedRule: PayerRule | null = null;
  loading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(private payerRuleService: PayerRuleService) {}

  ngOnInit(): void {
    this.loadPayerRules();
  }

  loadPayerRules(): void {
    this.loading = true;
    this.payerRuleService.getAllPayerRules().subscribe({
      next: (rules) => {
        this.payerRules = rules;
        this.filteredRules = rules;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payer rules';
        this.loading = false;
        console.error('Payer rules error:', err);
      }
    });
  }

  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredRules = this.payerRules;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRules = this.payerRules.filter(rule =>
        rule.payerName.toLowerCase().includes(term) ||
        rule.payerId.toLowerCase().includes(term)
      );
    }
  }

  viewRuleDetails(rule: PayerRule): void {
    this.selectedRule = rule;
  }

  closeDetails(): void {
    this.selectedRule = null;
  }
}