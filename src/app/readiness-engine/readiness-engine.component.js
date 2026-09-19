import { ApiService } from '../services/api.service.js';

export class ReadinessEngineComponent {
    constructor() {
        this.apiService = new ApiService();
        this.ruleSets = [];
        this.selectedRuleSet = null;
    }

    async render(container) {
        container.innerHTML = `
            <div class="card">
                <h2>Readiness Engine Configuration</h2>
                <p>Manage payer-specific rule sets and evaluation logic</p>
                <button class="btn btn-success" id="add-ruleset-btn">Add Rule Set</button>
                <button class="btn btn-primary" id="evaluate-all-btn">Evaluate All Applications</button>
            </div>
            <div class="card">
                <h3>Configured Rule Sets</h3>
                <div class="loading" id="ruleset-loading">Loading rule sets...</div>
                <div id="rulesets-table" class="hidden"></div>
            </div>
            <div id="ruleset-form-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="ruleset-form-title">Add Rule Set</h3>
                        <span class="modal-close" id="close-ruleset-modal">&times;</span>
                    </div>
                    <form id="ruleset-form">
                        <div class="form-group">
                            <label>Payer Name</label>
                            <input type="text" id="payerName" required>
                        </div>
                        <div class="form-group">
                            <label>Payer ID</label>
                            <input type="text" id="payerId" required>
                        </div>
                        <div class="form-group">
                            <label>Version</label>
                            <input type="text" id="version" required>
                        </div>
                        <div class="form-group">
                            <label>Effective Date</label>
                            <input type="date" id="effectiveDate" required>
                        </div>
                        <div class="form-group">
                            <label>Expiring Soon Threshold (days)</label>
                            <input type="number" id="expiringThreshold" value="90" required>
                        </div>
                        <div class="form-group">
                            <label>Required Documents (comma-separated)</label>
                            <textarea id="requiredDocuments" placeholder="Medical License, DEA Certificate, Malpractice Insurance" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Required Data Fields (comma-separated)</label>
                            <textarea id="requiredFields" placeholder="NPI, Tax ID, Practice Address" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Rule Description</label>
                            <textarea id="ruleDescription" required></textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Save Rule Set</button>
                            <button type="button" class="btn btn-secondary" id="cancel-ruleset-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.attachEventListeners();
        await this.loadRuleSets();
    }

    attachEventListeners() {
        const addBtn = document.getElementById('add-ruleset-btn');
        const evaluateBtn = document.getElementById('evaluate-all-btn');
        const closeModal = document.getElementById('close-ruleset-modal');
        const cancelBtn = document.getElementById('cancel-ruleset-btn');
        const form = document.getElementById('ruleset-form');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.showRuleSetForm());
        }

        if (evaluateBtn) {
            evaluateBtn.addEventListener('click', () => this.evaluateAllApplications());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.hideRuleSetForm());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideRuleSetForm());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.saveRuleSet(e));
        }
    }

    async loadRuleSets() {
        try {
            const response = await this.apiService.get('/api/rulesets');
            this.ruleSets = response;
            this.renderRuleSetsTable();
        } catch (error) {
            console.error('Error loading rule sets:', error);
            document.getElementById('ruleset-loading').innerHTML = '<div class="alert alert-error">Failed to load rule sets</div>';
        }
    }

    renderRuleSetsTable() {
        const loading = document.getElementById('ruleset-loading');
        const tableContainer = document.getElementById('rulesets-table');
        
        if (loading) loading.classList.add('hidden');
        if (tableContainer) tableContainer.classList.remove('hidden');

        const html = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Payer Name</th>
                        <th>Payer ID</th>
                        <th>Version</th>
                        <th>Effective Date</th>
                        <th>Expiring Threshold</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.ruleSets.map(ruleset => `
                        <tr>
                            <td>${ruleset.payerName}</td>
                            <td>${ruleset.payerId}</td>
                            <td>${ruleset.version}</td>
                            <td>${new Date(ruleset.effectiveDate).toLocaleDateString()}</td>
                            <td>${ruleset.expiringThreshold} days</td>
                            <td><span class="status-badge status-present">Active</span></td>
                            <td>
                                <button class="btn btn-primary" onclick="window.viewRuleSet('${ruleset.id}')">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;
        window.viewRuleSet = this.viewRuleSet.bind(this);
    }

    showRuleSetForm(ruleset = null) {
        const modal = document.getElementById('ruleset-form-modal');
        const formTitle = document.getElementById('ruleset-form-title');
        
        if (ruleset) {
            formTitle.textContent = 'Edit Rule Set';
            this.selectedRuleSet = ruleset;
            this.populateRuleSetForm(ruleset);
        } else {
            formTitle.textContent = 'Add Rule Set';
            this.selectedRuleSet = null;
            this.clearRuleSetForm();
        }

        modal.classList.add('active');
    }

    hideRuleSetForm() {
        const modal = document.getElementById('ruleset-form-modal');
        modal.classList.remove('active');
        this.clearRuleSetForm();
        this.selectedRuleSet = null;
    }

    populateRuleSetForm(ruleset) {
        document.getElementById('payerName').value = ruleset.payerName;
        document.getElementById('payerId').value = ruleset.payerId;
        document.getElementById('version').value = ruleset.version;
        document.getElementById('effectiveDate').value = ruleset.effectiveDate.split('T')[0];
        document.getElementById('expiringThreshold').value = ruleset.expiringThreshold;
        document.getElementById('requiredDocuments').value = ruleset.requiredDocuments.join(', ');
        document.getElementById('requiredFields').value = ruleset.requiredFields.join(', ');
        document.getElementById('ruleDescription').value = ruleset.ruleDescription;
    }

    clearRuleSetForm() {
        document.getElementById('ruleset-form').reset();
    }

    async saveRuleSet(event) {
        event.preventDefault();

        const ruleSetData = {
            id: this.selectedRuleSet ? this.selectedRuleSet.id : null,
            payerName: document.getElementById('payerName').value,
            payerId: document.getElementById('payerId').value,
            version: document.getElementById('version').value,
            effectiveDate: document.getElementById('effectiveDate').value,
            expiringThreshold: parseInt(document.getElementById('expiringThreshold').value),
            requiredDocuments: document.getElementById('requiredDocuments').value.split(',').map(d => d.trim()),
            requiredFields: document.getElementById('requiredFields').value.split(',').map(f => f.trim()),
            ruleDescription: document.getElementById('ruleDescription').value
        };

        try {
            if (this.selectedRuleSet) {
                await this.apiService.put(`/api/rulesets/${ruleSetData.id}`, ruleSetData);
            } else {
                await this.apiService.post('/api/rulesets', ruleSetData);
            }

            this.hideRuleSetForm();
            await this.loadRuleSets();
        } catch (error) {
            console.error('Error saving rule set:', error);
            alert('Failed to save rule set');
        }
    }

    viewRuleSet(ruleSetId) {
        const ruleset = this.ruleSets.find(r => r.id === ruleSetId);
        if (ruleset) {
            alert(`Rule Set Details:\n\nPayer: ${ruleset.payerName}\nVersion: ${ruleset.version}\nRequired Documents: ${ruleset.requiredDocuments.join(', ')}\nRequired Fields: ${ruleset.requiredFields.join(', ')}`);
        }
    }

    async evaluateAllApplications() {
        try {
            const response = await this.apiService.post('/api/readiness/evaluate-all', {});
            alert(`Evaluation complete! ${response.evaluatedCount} applications processed.`);
        } catch (error) {
            console.error('Error evaluating applications:', error);
            alert('Failed to evaluate applications');
        }
    }
}