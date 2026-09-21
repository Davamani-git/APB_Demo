import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    
      
        Provider Enrollment Readiness Management

        
          Work Queue
          Payer Rules
          Prebuilt Rules
        
      

    

    
      
    

  `,
  styles: []
})
export class AppComponent {
  title = 'Provider Enrollment Readiness Management';
}