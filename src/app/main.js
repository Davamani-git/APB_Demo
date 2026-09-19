import { AppComponent } from './app.component.js';
import { WorkQueueComponent } from './work-queue/work-queue.component.js';
import { DocumentMetadataComponent } from './document-metadata/document-metadata.component.js';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component.js';
import { ReadinessEngineComponent } from './readiness-engine/readiness-engine.component.js';
import { ExplanationViewComponent } from './explanation-view/explanation-view.component.js';

class Application {
    constructor() {
        this.components = new Map();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.registerComponents();
            this.bootstrap();
        });
    }

    registerComponents() {
        this.components.set('app-root', AppComponent);
        this.components.set('work-queue', WorkQueueComponent);
        this.components.set('document-metadata', DocumentMetadataComponent);
        this.components.set('manager-dashboard', ManagerDashboardComponent);
        this.components.set('readiness-engine', ReadinessEngineComponent);
        this.components.set('explanation-view', ExplanationViewComponent);
    }

    bootstrap() {
        const rootElement = document.querySelector('app-root');
        if (rootElement) {
            const appComponent = new AppComponent();
            appComponent.render(rootElement);
        }
    }
}

const app = new Application();