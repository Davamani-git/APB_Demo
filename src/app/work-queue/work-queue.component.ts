import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WorkQueueService } from '../services/work-queue.service';

interface WorkQueueItem {
  id: string;
  providerName: string;
  status: string;
  readinessScore: number;
  riskScore: number;
  priorityScore: number;
  payers: string[];
  coordinator: string;
  dueDate: string;
}

@Component({
  selector: 'app-work-queue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    
      Application Work Queue

      Prioritized list of applications ordered by risk and priority

    


    
      
        
          Filter by Status
          
            All Statuses
            Ready
            Pending
            Incomplete
          
        
        
          Filter by Payer
          
            All Payers
            {{ payer }}
          
        
        
          Filter by Coordinator
          
            All Coordinators
            {{ coord }}
          
        
        
          Sort By
          
            Priority Score
            Risk Score
            Due Date
            Readiness Score
          
        
      
    

    
      
        
          
            	Provider Name
            	Status
            	Priority Score
            	Risk Score
            	Readiness
            	Payers
            	Coordinator
            	Due Date
            	Actions
          
        
        
          
            	{{ item.providerName }}
            	
              {{ item.status }}
            
            	
              = 80,
                'priority-medium': item.priorityScore >= 50 && item.priorityScore < 80,
                'priority-low': item.priorityScore < 50
              }">{{ item.priorityScore }}
            
            	
              = 80,
                'priority-medium': item.riskScore >= 50 && item.riskScore < 80,
                'priority-low': item.riskScore < 50
              }">{{ item.riskScore }}
            
            	{{ item.readinessScore }}%
            	{{ item.payers.join(', ') }}
            	{{ item.coordinator }}
            	{{ item.dueDate | date: 'short' }}
            	
              View
              Deficiencies
            
          
        
      
      
        No applications match the selected filters.
      
    
  `
})
export class WorkQueueComponent implements OnInit {
  workQueue: WorkQueueItem[] = [];
  filteredQueue: WorkQueueItem[] = [];
  availablePayers: string[] = [];
  availableCoordinators: string[] = [];
  
  filterStatus = '';
  filterPayer = '';
  filterCoordinator = '';
  sortBy = 'priorityScore';

  constructor(private workQueueService: WorkQueueService) {}

  ngOnInit(): void {
    this.loadWorkQueue();
  }

  loadWorkQueue(): void {
    this.workQueueService.getWorkQueue().subscribe({
      next: (queue) => {
        this.workQueue = queue;
        this.extractFilterOptions();
        this.applyFilters();
      },
      error: (error) => console.error('Error loading work queue:', error)
    });
  }

  extractFilterOptions(): void {
    const payersSet = new Set();
    const coordinatorsSet = new Set();
    
    this.workQueue.forEach(item => {
      item.payers.forEach(payer => payersSet.add(payer));
      coordinatorsSet.add(item.coordinator);
    });
    
    this.availablePayers = Array.from(payersSet).sort();
    this.availableCoordinators = Array.from(coordinatorsSet).sort();
  }

  applyFilters(): void {
    let filtered = [...this.workQueue];

    if (this.filterStatus) {
      filtered = filtered.filter(item => item.status === this.filterStatus);
    }

    if (this.filterPayer) {
      filtered = filtered.filter(item => item.payers.includes(this.filterPayer));
    }

    if (this.filterCoordinator) {
      filtered = filtered.filter(item => item.coordinator === this.filterCoordinator);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[this.sortBy as keyof WorkQueueItem];
      const bVal = b[this.sortBy as keyof WorkQueueItem];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return bVal - aVal; // Descending for scores
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      
      return 0;
    });

    this.filteredQueue = filtered;
  }
}