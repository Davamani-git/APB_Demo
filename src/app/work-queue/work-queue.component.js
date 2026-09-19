import { ApiService } from '../services/api.service.js';
import { ExplanationViewComponent } from '../explanation-view/explanation-view.component.js';

export class WorkQueueComponent {
    constructor() {
        this.apiService = new ApiService();
        this.applications = [];
        this.selectedApplication = null;
        this.explanationView = new ExplanationViewComponent();
    }

    async render(container) {
        container.innerHTML = `
            <div class="card">
                <h2>Coordinator Work Queue</h2>
                <p>Active provider enrollment applications with readiness status</p>
                <div class="loading" id="loading">Loading applications...</div>
                <div id="applications-table" class="hidden"></div>
            </div>
            <div id="application-details" class="hidden"></div>
        `;

        await this.loadApplications();
    }

    async loadApplications() {
        try {
            const response = await this.apiService.get('/api/applications');
            this.applications = response;
            this.renderApplicationsTable();
        } catch (error) {
            console.error('Error loading applications:', error);
            document.getElementById('loading').innerHTML = '<div class="alert alert-error">Failed to load applications</div>';
        }
    }

    renderApplicationsTable() {
        const loading = document.getElementById('loading');
        const tableContainer = document.getElementById('applications-table');
        
        if (loading) loading.classList.add('hidden');
        if (tableContainer) tableContainer.classList.remove('hidden');

        const html = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Provider Name</th>
                        <th>Start Date</th>
                        <th>Readiness Status</th>
                        <th>Payers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.applications.map(app => `
                        <tr data-app-id="${app.id}">
                            <td>${app.id}</td>
                            <td>${app.providerName}</td>
                            <td>${new Date(app.startDate).toLocaleDateString()}</td>
                            <td><span class="status-badge status-${app.readinessStatus.toLowerCase().replace(' ', '-')}">${app.readinessStatus}</span></td>
                            <td>${app.payers.length}</td>
                            <td><button class="btn btn-primary" onclick="window.viewApplicationDetails('${app.id}')">View Details</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;
        window.viewApplicationDetails = this.viewApplicationDetails.bind(this);
    }

    async viewApplicationDetails(applicationId) {
        try {
            const response = await this.apiService.get(`/api/applications/${applicationId}/details`);
            this.selectedApplication = response;
            this.renderApplicationDetails();
        } catch (error) {
            console.error('Error loading application details:', error);
        }
    }

    renderApplicationDetails() {
        const detailsContainer = document.getElementById('application-details');
        if (!detailsContainer || !this.selectedApplication) return;

        detailsContainer.classList.remove('hidden');
        detailsContainer.innerHTML = `
            <div class="card">
                <div class="modal-header">
                    <h2>Application Details - ${this.selectedApplication.providerName}</h2>
                    <button class="btn btn-secondary" onclick="window.closeApplicationDetails()">Close</button>
                </div>
                <div>
                    <h3>Overall Status: <span class="status-badge status-${this.selectedApplication.readinessStatus.toLowerCase().replace(' ', '-')}">${this.selectedApplication.readinessStatus}</span></h3>
                    <h3 style="margin-top: 20px;">Payer Breakdown</h3>
                    ${this.selectedApplication.payers.map(payer => `
                        <div class="card" style="margin-top: 15px;">
                            <h4>${payer.payerName} - <span class="status-badge status-${payer.status.toLowerCase().replace(' ', '-')}">${payer.status}</span></h4>
                            <h5 style="margin-top: 15px;">Requirements</h5>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Requirement</th>
                                        <th>Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${payer.requirements.map(req => `
                                        <tr>
                                            <td>${req.name}</td>
                                            <td><span class="status-badge status-${req.status.toLowerCase().replace(' ', '-').replace('&', '')}">${req.status}</span></td>
                                            <td>${req.details || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <button class="btn btn-primary" onclick="window.viewExplanation('${this.selectedApplication.id}', '${payer.payerId}')">View Explanation</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        window.closeApplicationDetails = () => {
            detailsContainer.classList.add('hidden');
        };

        window.viewExplanation = this.viewExplanation.bind(this);
    }

    async viewExplanation(applicationId, payerId) {
        try {
            const response = await this.apiService.get(`/api/readiness/explanation/${applicationId}/${payerId}`);
            this.explanationView.show(response);
        } catch (error) {
            console.error('Error loading explanation:', error);
        }
    }
}