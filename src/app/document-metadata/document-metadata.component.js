import { ApiService } from '../services/api.service.js';

export class DocumentMetadataComponent {
    constructor() {
        this.apiService = new ApiService();
        this.documents = [];
        this.editingDocument = null;
    }

    async render(container) {
        container.innerHTML = `
            <div class="card">
                <h2>Document Metadata Management</h2>
                <p>Capture and manage credentialing document metadata with expiration tracking</p>
                <button class="btn btn-success" id="add-document-btn">Add New Document</button>
            </div>
            <div class="card">
                <h3>Document List</h3>
                <div class="loading" id="doc-loading">Loading documents...</div>
                <div id="documents-table" class="hidden"></div>
            </div>
            <div id="document-form-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="form-title">Add Document Metadata</h3>
                        <span class="modal-close" id="close-modal">&times;</span>
                    </div>
                    <form id="document-form">
                        <div class="form-group">
                            <label>Application ID</label>
                            <input type="text" id="applicationId" required>
                        </div>
                        <div class="form-group">
                            <label>Document Type</label>
                            <select id="documentType" required>
                                <option value="">Select Type</option>
                                <option value="Medical License">Medical License</option>
                                <option value="DEA Certificate">DEA Certificate</option>
                                <option value="Malpractice Insurance">Malpractice Insurance</option>
                                <option value="Board Certification">Board Certification</option>
                                <option value="State License">State License</option>
                                <option value="NPI Certificate">NPI Certificate</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Issue Date</label>
                            <input type="date" id="issueDate" required>
                        </div>
                        <div class="form-group">
                            <label>Expiration Date</label>
                            <input type="date" id="expirationDate" required>
                        </div>
                        <div class="form-group">
                            <label>Document Number</label>
                            <input type="text" id="documentNumber" required>
                        </div>
                        <div class="form-group">
                            <label>Issuing Authority</label>
                            <input type="text" id="issuingAuthority" required>
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea id="notes"></textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Save Document</button>
                            <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.attachEventListeners();
        await this.loadDocuments();
    }

    attachEventListeners() {
        const addBtn = document.getElementById('add-document-btn');
        const closeModal = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        const form = document.getElementById('document-form');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.showDocumentForm());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.hideDocumentForm());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideDocumentForm());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.saveDocument(e));
        }
    }

    async loadDocuments() {
        try {
            const response = await this.apiService.get('/api/documents');
            this.documents = response;
            this.renderDocumentsTable();
        } catch (error) {
            console.error('Error loading documents:', error);
            document.getElementById('doc-loading').innerHTML = '<div class="alert alert-error">Failed to load documents</div>';
        }
    }

    renderDocumentsTable() {
        const loading = document.getElementById('doc-loading');
        const tableContainer = document.getElementById('documents-table');
        
        if (loading) loading.classList.add('hidden');
        if (tableContainer) tableContainer.classList.remove('hidden');

        const html = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Document Type</th>
                        <th>Document Number</th>
                        <th>Issue Date</th>
                        <th>Expiration Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.documents.map(doc => {
                        const status = this.calculateDocumentStatus(doc.expirationDate);
                        return `
                            <tr>
                                <td>${doc.applicationId}</td>
                                <td>${doc.documentType}</td>
                                <td>${doc.documentNumber}</td>
                                <td>${new Date(doc.issueDate).toLocaleDateString()}</td>
                                <td>${new Date(doc.expirationDate).toLocaleDateString()}</td>
                                <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
                                <td>
                                    <button class="btn btn-primary" onclick="window.editDocument('${doc.id}')">Edit</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;
        window.editDocument = this.editDocument.bind(this);
    }

    calculateDocumentStatus(expirationDate) {
        const today = new Date();
        const expDate = new Date(expirationDate);
        const daysUntilExpiration = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration < 0) {
            return 'Expired';
        } else if (daysUntilExpiration <= 90) {
            return 'Expiring';
        } else {
            return 'Present';
        }
    }

    showDocumentForm(document = null) {
        const modal = document.getElementById('document-form-modal');
        const formTitle = document.getElementById('form-title');
        
        if (document) {
            formTitle.textContent = 'Edit Document Metadata';
            this.editingDocument = document;
            this.populateForm(document);
        } else {
            formTitle.textContent = 'Add Document Metadata';
            this.editingDocument = null;
            this.clearForm();
        }

        modal.classList.add('active');
    }

    hideDocumentForm() {
        const modal = document.getElementById('document-form-modal');
        modal.classList.remove('active');
        this.clearForm();
        this.editingDocument = null;
    }

    populateForm(document) {
        document.getElementById('applicationId').value = document.applicationId;
        document.getElementById('documentType').value = document.documentType;
        document.getElementById('issueDate').value = document.issueDate.split('T')[0];
        document.getElementById('expirationDate').value = document.expirationDate.split('T')[0];
        document.getElementById('documentNumber').value = document.documentNumber;
        document.getElementById('issuingAuthority').value = document.issuingAuthority;
        document.getElementById('notes').value = document.notes || '';
    }

    clearForm() {
        document.getElementById('document-form').reset();
    }

    async saveDocument(event) {
        event.preventDefault();

        const documentData = {
            id: this.editingDocument ? this.editingDocument.id : null,
            applicationId: document.getElementById('applicationId').value,
            documentType: document.getElementById('documentType').value,
            issueDate: document.getElementById('issueDate').value,
            expirationDate: document.getElementById('expirationDate').value,
            documentNumber: document.getElementById('documentNumber').value,
            issuingAuthority: document.getElementById('issuingAuthority').value,
            notes: document.getElementById('notes').value
        };

        try {
            if (this.editingDocument) {
                await this.apiService.put(`/api/documents/${documentData.id}`, documentData);
            } else {
                await this.apiService.post('/api/documents', documentData);
            }

            this.hideDocumentForm();
            await this.loadDocuments();
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Failed to save document');
        }
    }

    editDocument(documentId) {
        const document = this.documents.find(d => d.id === documentId);
        if (document) {
            this.showDocumentForm(document);
        }
    }
}