import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';
import { PayerRuleService } from '../services/payer-rule.service';

interface ApplicationDetail {
  id: string;
  providerId: string;
  providerName: string;
  coordinatorId: string;
  coordinatorName: string;
  overallStatus: string;
  priorityScore: number;
  submissionDate: string;
  lastUpdated: string;
  payers: PayerStatus[];
}

interface PayerStatus {
  payerId: string;
  payerName: string;
  status: string;
  requirements: Requirement[];
  recommendations: string[];
}

interface Requirement {
  type: string;
  name: string;
  status: string;
  expirationDate?: string;
  daysUntilExpiration?: number;
  value?: any;
}

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.css']
})
export class ApplicationDetailComponent implements OnInit {
  application: ApplicationDetail | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private payerRuleService: PayerRuleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplicationDetail(id);
    } else {
      this.error = 'No application ID provided';
      this.loading = false;
    }
  }

  loadApplicationDetail(id: string): void {
    this.loading = true;
    this.applicationService.getApplicationById(id).subscribe({
      next: (app) => {
        this.application = app;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load application details';
        this.loading = false;
        console.error('Application detail error:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'ready':
      case 'ready to submit':
      case 'present & valid':
      case 'present':
        return 'status-ready';
      case 'incomplete':
      case 'missing':
        return 'status-incomplete';
      case 'expiring':
      case 'expiring soon':
      case 'expired':
        return 'status-expiring';
      default:
        return '';
    }
  }

  getRequirementClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'present & valid':
      case 'present':
        return 'present';
      case 'missing':
        return 'missing';
      case 'expiring soon':
      case 'expired':
        return 'expiring';
      default:
        return '';
    }
  }

  exportReport(): void {
    if (this.application) {
      const report = this.generateReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `application-${this.application.id}-report.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  generateReport(): string {
    if (!this.application) return '';

    let report = `Provider Enrollment Application Report\n`;
    report += `==========================================\n\n`;
    report += `Application ID: ${this.application.id}\n`;
    report += `Provider: ${this.application.providerName} (${this.application.providerId})\n`;
    report += `Coordinator: ${this.application.coordinatorName}\n`;
    report += `Overall Status: ${this.application.overallStatus}\n`;
    report += `Priority Score: ${this.application.priorityScore}\n`;
    report += `Last Updated: ${this.application.lastUpdated}\n\n`;

    this.application.payers.forEach(payer => {
      report += `\nPayer: ${payer.payerName}\n`;
      report += `Status: ${payer.status}\n`;
      report += `\nRequirements:\n`;
      payer.requirements.forEach(req => {
        report += `  - ${req.name}: ${req.status}`;
        if (req.expirationDate) {
          report += ` (Expires: ${req.expirationDate})`;
        }
        report += `\n`;
      });
      if (payer.recommendations.length > 0) {
        report += `\nRecommendations:\n`;
        payer.recommendations.forEach(rec => {
          report += `  - ${rec}\n`;
        });
      }
      report += `\n`;
    });

    return report;
  }
}