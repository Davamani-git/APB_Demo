import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    
      Provider Enrollment Management System

      
        Dashboard
        Work Queue
        Risk Prioritization
      
    

    
      
    

  `
})
export class AppComponent {
  title = 'Provider Enrollment Management';
}