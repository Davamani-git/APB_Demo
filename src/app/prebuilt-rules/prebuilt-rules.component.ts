import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrebuiltRulesService } from '../services/prebuilt-rules.service.js';
import { PrebuiltRuleSet } from '../models/payer-rule.model.js';

@Component({
  selector: 'app-prebuilt-rules',
  standalone: true,
  imports: [CommonModule],
  template: `
    
      Prebuilt Payer Rule Sets

      Activate prebuilt rule sets for major payers


      Loading prebuilt rule sets...

      {{ error }}

      {{ successMessage }}


      
        
          {{ ruleSet.payerName }}

          Version: {{ ruleSet.version }}

          Description: {{ ruleSet.description }}

          Requirements: {{ ruleSet.requirements.length }} items

          Last Updated: {{ ruleSet.lastUpdated }}

          
            
              {{ ruleSet.isActivated ? 'Activated' : 'Not Activated' }}
            
          

          
            {{ ruleSet.isActivated ? 'Deactivate' : 'Activate' }}
          
        

      

    

  `,
  styles: []
})
export class PrebuiltRulesComponent implements OnInit {
  prebuiltRuleSets: PrebuiltRuleSet[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private prebuiltRulesService: PrebuiltRulesService) {}

  ngOnInit(): void {
    this.loadPrebuiltRuleSets();
  }

  loadPrebuiltRuleSets(): void {
    this.loading = true;
    this.prebuiltRulesService.getPrebuiltRuleSets().subscribe({
      next: (data) => {
        this.prebuiltRuleSets = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load prebuilt rule sets';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleActivation(ruleSet: PrebuiltRuleSet): void {
    const action = ruleSet.isActivated ? 'deactivate' : 'activate';
    
    this.prebuiltRulesService.activateRuleSet(ruleSet.id, !ruleSet.isActivated).subscribe({
      next: () => {
        ruleSet.isActivated = !ruleSet.isActivated;
        this.successMessage = `Rule set ${action}d successfully`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = `Failed to ${action} rule set`;
        console.error(err);
      }
    });
  }
}