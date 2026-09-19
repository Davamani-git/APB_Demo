import { WorkQueueComponent } from './work-queue/work-queue.component.js';
import { DocumentMetadataComponent } from './document-metadata/document-metadata.component.js';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component.js';
import { ReadinessEngineComponent } from './readiness-engine/readiness-engine.component.js';

export class AppComponent {
    constructor() {
        this.currentView = 'work-queue';
        this.components = {
            'work-queue': null,
            'document-metadata': null,
            'manager-dashboard': null,
            'readiness-engine': null
        };
    }

    render(container) {
        container.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>VK004Demo - Credentialing Readiness Engine</h1>
                    <p>Rule-Based Provider Credentialing Management System</p>
                </div>
                <div class="nav-tabs">
                    <div class="nav-tab active" data-view="work-queue">Work Queue</div>
                    <div class="nav-tab" data-view="document-metadata">Document Metadata</div>
                    <div class="nav-tab" data-view="readiness-engine">Readiness Engine</div>
                    <div class="nav-tab" data-view="manager-dashboard">Manager Dashboard</div>
                </div>
                <div id="content-area"></div>
            </div>
        `;

        this.attachEventListeners(container);
        this.loadView('work-queue');
    }

    attachEventListeners(container) {
        const tabs = container.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                this.switchView(view, container);
            });
        });
    }

    switchView(view, container) {
        const tabs = container.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-view') === view) {
                tab.classList.add('active');
            }
        });
        this.currentView = view;
        this.loadView(view);
    }

    loadView(view) {
        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;

        switch (view) {
            case 'work-queue':
                if (!this.components['work-queue']) {
                    this.components['work-queue'] = new WorkQueueComponent();
                }
                this.components['work-queue'].render(contentArea);
                break;
            case 'document-metadata':
                if (!this.components['document-metadata']) {
                    this.components['document-metadata'] = new DocumentMetadataComponent();
                }
                this.components['document-metadata'].render(contentArea);
                break;
            case 'readiness-engine':
                if (!this.components['readiness-engine']) {
                    this.components['readiness-engine'] = new ReadinessEngineComponent();
                }
                this.components['readiness-engine'].render(contentArea);
                break;
            case 'manager-dashboard':
                if (!this.components['manager-dashboard']) {
                    this.components['manager-dashboard'] = new ManagerDashboardComponent();
                }
                this.components['manager-dashboard'].render(contentArea);
                break;
        }
    }
}