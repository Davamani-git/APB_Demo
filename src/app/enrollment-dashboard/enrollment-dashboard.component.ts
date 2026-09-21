import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { ApplicationService } from '../services/application.service';

interface DashboardStats {
  totalApplications: number;
  readyApplications: number;
  pendingApplications: number;
  incompleteApplications: number;
  byCoordinator: { [key: string]: number };
  byPayer: { [key: string]: number };
}

interface Application {
  id: string;
  providerName: string;
  status: string;
  coordinator: string;
  payers: string[];
  readinessScore: number;
  lastUpdated: string;
}

@Component({
  selector: 'app-enrollment-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    
      Enrollment Manager Dashboard

      Monitor application status and workload distribution

    


    
      
        {{ stats.totalApplications }}

        Total Applications

      

      
        {{ stats.readyApplications }}

        Ready Applications

      

      
        {{ stats.pendingApplications }}

        Pending Applications

      

      
        {{ stats.incompleteApplications }}

        Incomplete Applications

      

    


    
      Applications by Coordinator

      
        
          
            	Coordinator
            	Application Count
          

        
        
          
            	{{ item.coordinator }}
            	{{ item.count }}
          

        
      

    


    
      Applications by Payer

      
        
          
            	Payer
            	Application Count
          

        
        
          
            	{{ item.payer }}
            	{{ item.count }}
          

        
      

    


    
      Recent Applications

      
        
          
            	Provider Name
            	Status
            	Coordinator
            	Payers
            	Readiness Score
            	Last Updated
            	Actions
          

        
        
          
            	{{ app.providerName }}
            	
              {{ app.status }}
            
            	{{ app.coordinator }}
            	{{ app.payers.join(', ') }}
            	{{ app.readinessScore }}%
            	{{ app.lastUpdated | date: 'short' }}
            	
              View Details
            
          

        
      

    

  `
})
export class EnrollmentDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  coordinatorStats: { coordinator: string; count: number }[] = [];
  payerStats: { payer: string; count: number }[] = [];
  applications: Application[] = [];

  constructor(
    private dashboardService: DashboardService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadApplications();
  }

  loadDashboardStats(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.coordinatorStats = Object.entries(stats.byCoordinator).map(([coordinator, count]) => ({
          coordinator,
          count
        }));
        this.payerStats = Object.entries(stats.byPayer).map(([payer, count]) => ({
          payer,
          count
        }));
      },
      error: (error) => console.error('Error loading dashboard stats:', error)
    });
  }

  loadApplications(): void {
    this.applicationService.getApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
      },
      error: (error) => console.error('Error loading applications:', error)
    });
  }
}