import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayerRulesService } from '../services/payer-rules.service.js';
import { PayerRuleSet } from '../models/payer-rule.model.js';

@Component({
  selector: 'app-payer-rules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    
      Payer Requirement Rule Library

      Manage payer-specific enrollment requirements


      
        + Create New Rule Set
      

      Loading rule sets...

      {{ error }}

      {{ successMessage }}


      
        
          
            	Payer Name
            	Version
            	Effective Date
            	Requirements Count
            	Status
            	Actions
          

        
        
          
            	{{ ruleSet.payerName }}
            	{{ ruleSet.version }}
            	{{ ruleSet.effectiveDate }}
            	{{ ruleSet.requirements.length }}
            	
              
                {{ ruleSet.isActive ? 'Active' : 'Inactive' }}
              
            
            	
              
                Edit
              
              
                Delete
              
            
          

        
      

    


    
    
      
        
          {{ isEditMode ? 'Edit' : 'Create' }} Rule Set

          ×
        

        
          
            Payer Name
            
          

          
            Version
            
          

          
            Effective Date
            
          

          
            
              
              Active
            
          

          
            Requirements (JSON format)
            
            Enter requirements as JSON array
          

          Save
          Cancel
        

      

    

  `,
  styles: []
})
export class PayerRulesComponent implements OnInit {
  ruleSets: PayerRuleSet[] = [];
  loading = false;
  error = '';
  successMessage = '';
  showModal = false;
  isEditMode = false;
  currentRuleSet: PayerRuleSet = this.getEmptyRuleSet();
  requirementsJson = '[]';

  constructor(private payerRulesService: PayerRulesService) {}

  ngOnInit(): void {
    this.loadRuleSets();
  }

  loadRuleSets(): void {
    this.loading = true;
    this.payerRulesService.getRuleSets().subscribe({
      next: (data) => {
        this.ruleSets = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load rule sets';
        this.loading = false;
        console.error(err);
      }
    });
  }

  showCreateModal(): void {
    this.isEditMode = false;
    this.currentRuleSet = this.getEmptyRuleSet();
    this.requirementsJson = '[]';
    this.showModal = true;
  }

  editRuleSet(ruleSet: PayerRuleSet): void {
    this.isEditMode = true;
    this.currentRuleSet = { ...ruleSet };
    this.requirementsJson = JSON.stringify(ruleSet.requirements, null, 2);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.successMessage = '';
    this.error = '';
  }

  saveRuleSet(): void {
    try {
      this.currentRuleSet.requirements = JSON.parse(this.requirementsJson);
      
      const saveObservable = this.isEditMode
        ? this.payerRulesService.updateRuleSet(this.currentRuleSet)
        : this.payerRulesService.createRuleSet(this.currentRuleSet);

      saveObservable.subscribe({
        next: () => {
          this.successMessage = `Rule set ${this.isEditMode ? 'updated' : 'created'} successfully`;
          this.closeModal();
          this.loadRuleSets();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = 'Failed to save rule set';
          console.error(err);
        }
      });
    } catch (e) {
      this.error = 'Invalid JSON format for requirements';
    }
  }

  deleteRuleSet(id: string): void {
    if (confirm('Are you sure you want to delete this rule set?')) {
      this.payerRulesService.deleteRuleSet(id).subscribe({
        next: () => {
          this.successMessage = 'Rule set deleted successfully';
          this.loadRuleSets();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete rule set';
          console.error(err);
        }
      });
    }
  }

  getEmptyRuleSet(): PayerRuleSet {
    return {
      id: '',
      payerName: '',
      version: '1.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      isActive: true,
      requirements: []
    };
  }
}