import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EnrollmentService } from '../services/enrollment.service.js';
import { EnrollmentApplication } from '../models/enrollment-application.model.js';

@Component({
  selector: 'app-work-queue',
  standalone: true,
  imports: [CommonModule],
  template: `
    
      Enrollment Application Work Queue

      Prioritized view of all active enrollment applications

      
      
        
          Total Applications

          {{ applications.length }}

        

        
          High Priority

          {{ getHighPriorityCount() }}

        

        
          Ready to Submit

          {{ getReadyCount() }}

        

      


      Loading applications...

      {{ error }}


      
        
          
            	Application ID
            	Provider Name
            	Status
            	Priority
            	Target Payers
            	Days Until Expiration
            	Actions
          

        
        
          
            	{{ app.id }}
            	{{ app.providerName }}
            	
              
                {{ app.overallStatus }}
              
            
            	
              
                {{ app.priority }}
              
            
            	{{ app.targetPayers.join(', ') }}
            	{{ app.daysUntilExpiration }}
            	
              
                View Details
              
            
          

        
      

    

  `,
  styles: []
})
export class WorkQueueComponent implements OnInit {
  applications: EnrollmentApplication[] = [];
  loading = false;
  error = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.enrollmentService.getApplications().subscribe({
      next: (data) => {
        this.applications = this.sortByPriority(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load applications';
        this.loading = false;
        console.error(err);
      }
    });
  }

  sortByPriority(apps: EnrollmentApplication[]): EnrollmentApplication[] {
    const priorityOrder: { [key: string]: number } = { 'High': 1, 'Medium': 2, 'Low': 3 };
    return apps.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.daysUntilExpiration - b.daysUntilExpiration;
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Ready to Submit': 'status-ready',
      'Incomplete': 'status-incomplete',
      'Expiring Soon': 'status-expiring'
    };
    return statusMap[status] || '';
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getHighPriorityCount(): number {
    return this.applications.filter(app => app.priority === 'High').length;
  }

  getReadyCount(): number {
    return this.applications.filter(app => app.overallStatus === 'Ready to Submit').length;
  }

  viewDetails(id: string): void {
    this.router.navigate(['/application', id]);
  }
}