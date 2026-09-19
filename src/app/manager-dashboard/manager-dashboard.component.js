import { ApiService } from '../services/api.service.js';

export class ManagerDashboardComponent {
    constructor() {
        this.apiService = new ApiService();
        this.dashboardData = null;
    }

    async render(container) {
        container.innerHTML = `
            <div class="card">
                <h2>Manager Pipeline Dashboard</h2>
                <p>Portfolio-level visibility into credentialing pipeline and KPIs</p>
            </div>
            <div class="loading" id="dashboard-loading">Loading dashboard data...</div>
            <div id="dashboard-content" class="hidden"></div>
        `;

        await this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            const response = await this.apiService.get('/api/dashboard/manager');
            this.dashboardData = response;
            this.renderDashboard();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            document.getElementById('dashboard-loading').innerHTML = '<div class="alert alert-error">Failed to load dashboard data</div>';
        }
    }

    renderDashboard() {
        const loading = document.getElementById('dashboard-loading');
        const contentContainer = document.getElementById('dashboard-content');
        
        if (loading) loading.classList.add('hidden');
        if (contentContainer) contentContainer.classList.remove('hidden');

        const html = `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Total Applications</h3>
                    <div class="value">${this.dashboardData.totalApplications}</div>
                </div>
                <div class="dashboard-card">
                    <h3>Ready to Submit</h3>
                    <div class="value" style="color: #28a745;">${this.dashboardData.readyToSubmit}</div>
                </div>
                <div class="dashboard-card">
                    <h3>Incomplete</h3>
                    <div class="value" style="color: #dc3545;">${this.dashboardData.incomplete}</div>
                </div>
                <div class="dashboard-card">
                    <h3>Expiring Soon</h3>
                    <div class="value" style="color: #ffc107;">${this.dashboardData.expiringSoon}</div>
                </div>
            </div>

            <div class="card">
                <h3>At-Risk Applications</h3>
                <p>Applications requiring immediate attention</p>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Application ID</th>
                            <th>Provider Name</th>
                            <th>Start Date</th>
                            <th>Status</th>
                            <th>Days Until Start</th>
                            <th>Risk Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.dashboardData.atRiskApplications.map(app => `
                            <tr>
                                <td>${app.id}</td>
                                <td>${app.providerName}</td>
                                <td>${new Date(app.startDate).toLocaleDateString()}</td>
                                <td><span class="status-badge status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span></td>
                                <td>${app.daysUntilStart}</td>
                                <td><span class="status-badge status-${app.riskLevel.toLowerCase()}">${app.riskLevel}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h3>KPI Summary</h3>
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Average Days to Ready</h3>
                        <div class="value" style="font-size: 28px;">${this.dashboardData.kpis.avgDaysToReady}</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Completion Rate</h3>
                        <div class="value" style="font-size: 28px;">${this.dashboardData.kpis.completionRate}%</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Rejection Rate</h3>
                        <div class="value" style="font-size: 28px;">${this.dashboardData.kpis.rejectionRate}%</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Active Coordinators</h3>
                        <div class="value" style="font-size: 28px;">${this.dashboardData.kpis.activeCoordinators}</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>Pipeline by Payer</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Payer Name</th>
                            <th>Total Applications</th>
                            <th>Ready</th>
                            <th>Incomplete</th>
                            <th>Expiring Soon</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.dashboardData.payerBreakdown.map(payer => `
                            <tr>
                                <td>${payer.payerName}</td>
                                <td>${payer.total}</td>
                                <td>${payer.ready}</td>
                                <td>${payer.incomplete}</td>
                                <td>${payer.expiringSoon}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="card">
                <button class="btn btn-primary" onclick="window.exportReport()">Export Weekly Report</button>
                <button class="btn btn-secondary" onclick="window.refreshDashboard()">Refresh Dashboard</button>
            </div>
        `;

        contentContainer.innerHTML = html;
        window.exportReport = this.exportReport.bind(this);
        window.refreshDashboard = this.loadDashboardData.bind(this);
    }

    exportReport() {
        alert('Exporting weekly report... (Feature to be implemented)');
    }
}