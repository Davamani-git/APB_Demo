import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../services/application.service';

interface Application {
  id: string;
  providerId: string;
  providerName: string;
  coordinatorId: string;
  coordinatorName: string;
  overallStatus: string;
  priorityScore: number;
  submissionDate: string;
  lastUpdated: string;
  payers: any[];
}

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  loading = true;
  error: string | null = null;

  // Filter properties
  filterStatus = '';
  filterCoordinator = '';
  filterPayer = '';
  searchTerm = '';

  coordinators: string[] = [];
  payers: string[] = [];

  constructor(
    private applicationService: ApplicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.filterStatus = params['status'];
      }
    });
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAllApplications().subscribe({
      next: (apps) => {
        this.applications = apps.sort((a, b) => b.priorityScore - a.priorityScore);
        this.extractFilterOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load applications';
        this.loading = false;
        console.error('Application list error:', err);
      }
    });
  }

  extractFilterOptions(): void {
    const coordSet = new Set<string>();
    const payerSet = new Set<string>();

    this.applications.forEach(app => {
      coordSet.add(app.coordinatorName);
      app.payers?.forEach((p: any) => payerSet.add(p.payerName));
    });

    this.coordinators = Array.from(coordSet).sort();
    this.payers = Array.from(payerSet).sort();
  }

  applyFilters(): void {
    this.filteredApplications = this.applications.filter(app => {
      let matches = true;

      if (this.filterStatus) {
        const statusMatch = app.overallStatus.toLowerCase().includes(this.filterStatus.toLowerCase());
        matches = matches && statusMatch;
      }

      if (this.filterCoordinator) {
        matches = matches && app.coordinatorName === this.filterCoordinator;
      }

      if (this.filterPayer) {
        const hasPayerMatch = app.payers?.some((p: any) => p.payerName === this.filterPayer);
        matches = matches && hasPayerMatch;
      }

      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const searchMatch = 
          app.providerName.toLowerCase().includes(searchLower) ||
          app.providerId.toLowerCase().includes(searchLower) ||
          app.id.toLowerCase().includes(searchLower);
        matches = matches && searchMatch;
      }

      return matches;
    });
  }

  viewApplication(id: string): void {
    this.router.navigate(['/applications', id]);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'ready':
      case 'ready to submit':
        return 'status-ready';
      case 'incomplete':
        return 'status-incomplete';
      case 'expiring':
      case 'expiring soon':
        return 'status-expiring';
      default:
        return '';
    }
  }

  getPriorityClass(score: number): string {
    if (score >= 80) return 'priority-high';
    if (score >= 50) return 'priority-medium';
    return 'priority-low';
  }

  resetFilters(): void {
    this.filterStatus = '';
    this.filterCoordinator = '';
    this.filterPayer = '';
    this.searchTerm = '';
    this.applyFilters();
  }
}