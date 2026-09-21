import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DeficiencyService } from '../services/deficiency.service';

interface DeficiencyItem {
  requirementId: string;
  requirementName: string;
  documentName: string;
  status: string;
  deadline: string;
  urgency: string;
  outreachText: string;
  payerName: string;
}

@Component({
  selector: 'app-deficiency-guidance',
  standalone: true,
  imports: [CommonModule],
  template: `
    
      Deficiency and Outreach Guidance

      ← Back
      Provider: {{ providerName }}

    


     0">
      Missing or Expired Requirements

      
        
          
            
              {{ deficiency.requirementName }}
              {{ deficiency.urgency }} Urgency
            
            
              Payer: {{ deficiency.payerName }}

              Deadline: {{ deficiency.deadline | date: 'short' }}

            
          
          
            Document Required: {{ deficiency.documentName }}
          
          
            Status: {{ deficiency.status }}
          
          
            Outreach Text:
            {{ deficiency.outreachText }}

          
          
            Copy Outreach Text
          
        
      
    

    
      
        ✓ No deficiencies found. All requirements are met.
      
    

    
      Loading deficiency information...

    
  `
})
export class DeficiencyGuidanceComponent implements OnInit {
  applicationId: string = '';
  providerName: string = '';
  deficiencies: DeficiencyItem[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deficiencyService: DeficiencyService
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.applicationId) {
      this.loadDeficiencies();
    }
  }

  loadDeficiencies(): void {
    this.loading = true;
    this.deficiencyService.getDeficiencies(this.applicationId).subscribe({
      next: (data) => {
        this.deficiencies = data.deficiencies;
        this.providerName = data.providerName;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading deficiencies:', error);
        this.loading = false;
      }
    });
  }

  copyOutreachText(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Outreach text copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text:', err);
    });
  }

  goBack(): void {
    this.router.navigate(['/application', this.applicationId]);
  }
}