import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';

interface ApplicationData {
  id: string;
  providerName: string;
  npi: string;
  taxId: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  enrollmentType: string;
  status: string;
  coordinator: string;
  payers: PayerData[];
  documents: DocumentData[];
  readinessScore: number;
  createdDate: string;
  lastUpdated: string;
}

interface PayerData {
  payerId: string;
  payerName: string;
  status: string;
  readinessStatus: string;
  requirements: RequirementData[];
}

interface RequirementData {
  requirementId: string;
  requirementName: string;
  status: string;
  expirationDate?: string;
  documentId?: string;
}

interface DocumentData {
  documentId: string;
  documentName: string;
  documentType: string;
  uploadDate: string;
  expirationDate?: string;
  payerId?: string;
}

@Component({
  selector: 'app-application-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    
      Provider Application Data Management

      ← Back to Work Queue
    


    
      Application Information

      
        
          
            Provider Name *
            
          
          
            NPI *
            
          
          
            Tax ID *
            
          
          
            Specialty *
            
          
          
            Phone *
            
          
          
            Email *
            
          
          
            Enrollment Type *
            
              Select Type
              New Enrollment
              Re-credentialing
            
          
          
            Coordinator *
            
          
        
        
          Address *
          
        
        Save Application
      
    

    
      Payer Readiness Status

      
        
          
            	Payer Name
            	Status
            	Readiness Status
            	Requirements Met
          
        
        
          
            	{{ payer.payerName }}
            	
              {{ payer.status }}
            
            	{{ payer.readinessStatus }}
            	{{ getRequirementsMet(payer) }} / {{ payer.requirements.length }}
          
        
      
    

    
      Documents

      
        
          {{ showDocumentUpload ? 'Cancel' : 'Upload Document' }}
        
      
      
      
        Upload New Document

        
          Document Name
          
        
        
          Document Type
          
            Select Type
            License
            Certificate
            Insurance
            Credential
            Other
          
        
        
          Associated Payer (Optional)
          
            None
            {{ payer.payerName }}
          
        
        
          Expiration Date (Optional)
          
        
        Upload
      

      
        
          
            	Document Name
            	Type
            	Upload Date
            	Expiration Date
            	Associated Payer
            	Actions
          
        
        
          
            	{{ doc.documentName }}
            	{{ doc.documentType }}
            	{{ doc.uploadDate | date: 'short' }}
            	{{ doc.expirationDate ? (doc.expirationDate | date: 'short') : 'N/A' }}
            	{{ getPayerName(doc.payerId) }}
            	
              Delete
            
          
        
      
    
  `
})
export class ApplicationManagementComponent implements OnInit {
  applicationId: string = '';
  application: ApplicationData | null = null;
  applicationForm: FormGroup | null = null;
  showDocumentUpload = false;
  newDocument: any = {
    documentName: '',
    documentType: '',
    payerId: '',
    expirationDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.applicationId) {
      this.loadApplication();
    }
  }

  loadApplication(): void {
    this.applicationService.getApplicationById(this.applicationId).subscribe({
      next: (app) => {
        this.application = app;
        this.initializeForm();
      },
      error: (error) => console.error('Error loading application:', error)
    });
  }

  initializeForm(): void {
    if (!this.application) return;
    
    this.applicationForm = this.fb.group({
      providerName: [this.application.providerName, Validators.required],
      npi: [this.application.npi, Validators.required],
      taxId: [this.application.taxId, Validators.required],
      specialty: [this.application.specialty, Validators.required],
      address: [this.application.address, Validators.required],
      phone: [this.application.phone, Validators.required],
      email: [this.application.email, [Validators.required, Validators.email]],
      enrollmentType: [this.application.enrollmentType, Validators.required],
      coordinator: [this.application.coordinator, Validators.required]
    });
  }

  saveApplication(): void {
    if (!this.applicationForm || !this.applicationForm.valid) return;
    
    const updatedData = {
      ...this.application,
      ...this.applicationForm.value
    };
    
    this.applicationService.updateApplication(this.applicationId, updatedData).subscribe({
      next: () => {
        alert('Application saved successfully!');
        this.loadApplication();
      },
      error: (error) => console.error('Error saving application:', error)
    });
  }

  uploadDocument(): void {
    if (!this.newDocument.documentName || !this.newDocument.documentType) {
      alert('Please fill in required document fields');
      return;
    }
    
    const document = {
      ...this.newDocument,
      documentId: 'DOC-' + Date.now(),
      uploadDate: new Date().toISOString()
    };
    
    this.applicationService.addDocument(this.applicationId, document).subscribe({
      next: () => {
        this.showDocumentUpload = false;
        this.newDocument = { documentName: '', documentType: '', payerId: '', expirationDate: '' };
        this.loadApplication();
      },
      error: (error) => console.error('Error uploading document:', error)
    });
  }

  deleteDocument(documentId: string): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.applicationService.deleteDocument(this.applicationId, documentId).subscribe({
        next: () => this.loadApplication(),
        error: (error) => console.error('Error deleting document:', error)
      });
    }
  }

  getRequirementsMet(payer: PayerData): number {
    return payer.requirements.filter(req => req.status === 'Met').length;
  }

  getPayerName(payerId?: string): string {
    if (!payerId || !this.application) return 'N/A';
    const payer = this.application.payers.find(p => p.payerId === payerId);
    return payer ? payer.payerName : 'N/A';
  }

  goBack(): void {
    this.router.navigate(['/work-queue']);
  }
}