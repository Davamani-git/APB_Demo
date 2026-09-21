import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadinessService } from '../services/readiness.service';

interface ReadinessEvaluation {
  applicationId: string;
  providerName: string;
  overallReadiness: string;
  overallScore: number;
  evaluationDate: string;
  ruleSetVersion: string;
  payerEvaluations: PayerEvaluation[];
}

interface PayerEvaluation {
  payerId: string;
  payerName: string;
  readinessStatus: string;
  readinessScore: number;
  ruleSetVersion: string;
  requirementResults: RequirementResult[];
}

interface RequirementResult {
  requirementId: string;
  requirementName: string;
  status: string;
  result: string;
  notes: string;
}

@Component({
  selector: 'app-readiness-evaluation',
  standalone: true,
  imports: [CommonModule],
  template: `
    
      Payer-Specific Readiness Evaluation

      ← Back
    


    
      Overall Readiness

      
        
          {{ evaluation.overallScore }}%

          Overall Readiness Score

        
        
          {{ evaluation.overallReadiness }}

          Overall Status

        
        
          {{ evaluation.ruleSetVersion }}

          Rule Set Version

        
        
          {{ evaluation.evaluationDate | date: 'short' }}

          Evaluation Date

        
      
    

    
      {{ payer.payerName }}

      
        
          Readiness Status:
          {{ payer.readinessStatus }}
        
        
          Readiness Score: {{ payer.readinessScore }}%
        
        
          Rule Set Version: {{ payer.ruleSetVersion }}
        
      

      Requirement Evaluation Results

      
        
          
            	Requirement
            	Status
            	Result
            	Notes
          
        
        
          
            	{{ req.requirementName }}
            	
              {{ req.status }}
            
            	{{ req.result }}
            	{{ req.notes }}
          
        
      
    

    
      No evaluation data available.

    

    
      Loading readiness evaluation...

    
  `
})
export class ReadinessEvaluationComponent implements OnInit {
  applicationId: string = '';
  evaluation: ReadinessEvaluation | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readinessService: ReadinessService
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.applicationId) {
      this.loadEvaluation();
    }
  }

  loadEvaluation(): void {
    this.loading = true;
    this.readinessService.evaluateReadiness(this.applicationId).subscribe({
      next: (evaluation) => {
        this.evaluation = evaluation;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading readiness evaluation:', error);
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Ready': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Incomplete': return '#dc3545';
      default: return '#6c757d';
    }
  }

  goBack(): void {
    this.router.navigate(['/application', this.applicationId]);
  }
}