import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RiskPrioritizationService } from '../services/risk-prioritization.service';

interface RiskScoredApplication {
  id: string;
  providerName: string;
  riskScore: number;
  priorityScore: number;
  riskFactors: string[];
  priorityFactors: string[];
  status: string;
  dueDate: string;
}

@Component({
  selector: 'app-risk-prioritization',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    
      Risk-Based Application Prioritization

      Applications scored by risk and priority for work queue ordering

    


    
      Risk and Priority Scoring

      
        
          
            	Provider Name
            	Risk Score
            	Priority Score
            	Risk Factors
            	Priority Factors
            	Status
            	Due Date
            	Actions
          
        
        
          
            	{{ app.providerName }}
            	
              
                = 80,
                  'priority-medium': app.riskScore >= 50 && app.riskScore < 80,
                  'priority-low': app.riskScore < 50
                }">{{ app.riskScore }}
                
                  

                
              
            
            	
              
                = 80,
                  'priority-medium': app.priorityScore >= 50 && app.priorityScore < 80,
                  'priority-low': app.priorityScore < 50
                }">{{ app.priorityScore }}
                
                  

                
              
            
            	
              
                	{{ factor }}

              
            
            	
              
                	{{ factor }}

              
            
            	
              {{ app.status }}
            
            	{{ app.dueDate | date: 'short' }}
            	
              View
            
          
        
      
    

    
      No applications available for risk scoring.

    

    
      Loading risk prioritization data...

    
  `
})
export class RiskPrioritizationComponent implements OnInit {
  applications: RiskScoredApplication[] = [];
  loading = true;

  constructor(private riskPrioritizationService: RiskPrioritizationService) {}

  ngOnInit(): void {
    this.loadRiskScores();
  }

  loadRiskScores(): void {
    this.loading = true;
    this.riskPrioritizationService.getRiskScoredApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading risk scores:', error);
        this.loading = false;
      }
    });
  }

  getRiskColor(score: number): string {
    if (score >= 80) return '#dc3545';
    if (score >= 50) return '#ffc107';
    return '#28a745';
  }

  getPriorityColor(score: number): string {
    if (score >= 80) return '#dc3545';
    if (score >= 50) return '#ffc107';
    return '#28a745';
  }
}