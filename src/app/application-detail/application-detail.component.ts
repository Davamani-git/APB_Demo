import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentService } from '../services/enrollment.service.js';
import { EnrollmentApplication, PayerRequirement, RequirementDeficiency } from '../models/enrollment-application.model.js';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    Loading application details...

    {{ error }}


    
      
        ← Back to Work Queue
      

      
        Application Details - {{ application.providerName }}

        
          
            Application ID: {{ application.id }}
          

          
            Status:
            
              {{ application.overallStatus }}
            
          

          
            Priority:
            
              {{ application.priority }}
            
          

          
            Days Until Expiration: {{ application.daysUntilExpiration }}
          

        

      


      
        {{ payer.payerName }} Requirements

        
          Payer Status:
          
            {{ payer.payerStatus }}
          
        


        Requirement-Level Status

        
          
            
              	Requirement
              	Type
              	Status
              	Expiration Date
              	Details
            

          
          
            
              	{{ req.requirementName }}
              	{{ req.requirementType }}
              	
                
                  {{ req.status }}
                
              
              	{{ req.expirationDate || 'N/A' }}
              	{{ req.details }}
            

          
        


         0" style="margin-top: 20px;">
          Deficiencies and Outreach Guidance

          
            {{ deficiency.requirementName }}

            Issue: {{ deficiency.issue }}

            Expiration Date: {{ deficiency.expirationDate || 'N/A' }}

            
              Outreach Recommendations:
              
                	
                  {{ recommendation }}
                

              

            

          

        

      

    

  `,
  styles: []
})
export class ApplicationDetailComponent implements OnInit {
  application: EnrollmentApplication | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(id);
    }
  }

  loadApplication(id: string): void {
    this.loading = true;
    this.enrollmentService.getApplicationById(id).subscribe({
      next: (data) => {
        this.application = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load application details';
        this.loading = false;
        console.error(err);
      }
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

  getRequirementStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Present & Valid': 'status-present',
      'Missing': 'status-missing',
      'Expired': 'status-expired',
      'Expiring Soon': 'status-expiring'
    };
    return statusMap[status] || '';
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  goBack(): void {
    this.router.navigate(['/work-queue']);
  }
}