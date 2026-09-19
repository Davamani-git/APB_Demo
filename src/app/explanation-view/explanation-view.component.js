export class ExplanationViewComponent {
    constructor() {
        this.currentExplanation = null;
    }

    show(explanation) {
        this.currentExplanation = explanation;
        this.render();
    }

    render() {
        const existingModal = document.getElementById('explanation-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'explanation-modal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Readiness Explanation</h3>
                    <span class="modal-close" id="close-explanation-modal">&times;</span>
                </div>
                <div>
                    <h4>Application: ${this.currentExplanation.applicationId}</h4>
                    <h4>Payer: ${this.currentExplanation.payerName}</h4>
                    <h4>Overall Status: <span class="status-badge status-${this.currentExplanation.status.toLowerCase().replace(' ', '-')}">${this.currentExplanation.status}</span></h4>
                    
                    <div class="card" style="margin-top: 20px;">
                        <h4>Rule Set Information</h4>
                        <p><strong>Rule Set Version:</strong> ${this.currentExplanation.ruleSetVersion}</p>
                        <p><strong>Effective Date:</strong> ${new Date(this.currentExplanation.ruleSetEffectiveDate).toLocaleDateString()}</p>
                        <p><strong>Evaluation Date:</strong> ${new Date(this.currentExplanation.evaluationDate).toLocaleString()}</p>
                    </div>

                    <div class="card" style="margin-top: 20px;">
                        <h4>Decision Explanation</h4>
                        <p>${this.currentExplanation.explanation}</p>
                    </div>

                    <div class="card" style="margin-top: 20px;">
                        <h4>Requirement Details</h4>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Requirement</th>
                                    <th>Status</th>
                                    <th>Rule Applied</th>
                                    <th>Explanation</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.currentExplanation.requirements.map(req => `
                                    <tr>
                                        <td>${req.name}</td>
                                        <td><span class="status-badge status-${req.status.toLowerCase().replace(' ', '-').replace('&', '')}">${req.status}</span></td>
                                        <td>${req.ruleApplied}</td>
                                        <td>${req.explanation}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    ${this.currentExplanation.recommendations && this.currentExplanation.recommendations.length > 0 ? `
                        <div class="card" style="margin-top: 20px;">
                            <h4>Recommendations</h4>
                            <ul>
                                ${this.currentExplanation.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = document.getElementById('close-explanation-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }

    hide() {
        const modal = document.getElementById('explanation-modal');
        if (modal) {
            modal.remove();
        }
    }
}