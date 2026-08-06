angular.module('executiveDashboard').service('TestingScopeService', ['LocalStorageService', 'CalculationFactory', function(LocalStorageService, CalculationFactory) {
const STORAGE_KEY = 'dashboard.testingScopes';
const defaultScopes = [
{id: 'sprint', name: 'Sprint Testing', status: 'In Progress', useCasesCompleted: 45, useCasesTotal: 60, agentsCompleted: 12, agentsTotal: 20, agentificationETA: 'Mar 2024'},
{id: 'regression', name: 'Regression Testing', status: 'In Progress', useCasesCompleted: 78, useCasesTotal: 100, agentsCompleted: 25, agentsTotal: 35, agentificationETA: 'Apr 2024'},
{id: 'apiAutomation', name: 'API Automation', status: 'In Progress', useCasesCompleted: 32, useCasesTotal: 50, agentsCompleted: 8, agentsTotal: 15, agentificationETA: 'May 2024'},
{id: 'uiAutomation', name: 'UI Automation', status: 'In Progress', useCasesCompleted: 55, useCasesTotal: 80, agentsCompleted: 18, agentsTotal: 28, agentificationETA: 'Jun 2024'},
{id: 'performance', name: 'Performance Testing', status: 'Design in Progress', useCasesCompleted: 10, useCasesTotal: 40, agentsCompleted: 2, agentsTotal: 12, agentificationETA: 'Jul 2024'},
{id: 'deployment', name: 'Deployment Testing', status: 'Design in Progress', useCasesCompleted: 8, useCasesTotal: 30, agentsCompleted: 1, agentsTotal: 10, agentificationETA: 'Aug 2024'},
{id: 'rollback', name: 'Roll Back Testing', status: 'Design in Progress', useCasesCompleted: 5, useCasesTotal: 25, agentsCompleted: 0, agentsTotal: 8, agentificationETA: 'Sep 2024'},
{id: 'backwardCompat', name: 'Backward Compatibility Testing', status: 'Design in Progress', useCasesCompleted: 12, useCasesTotal: 35, agentsCompleted: 3, agentsTotal: 10, agentificationETA: 'Oct 2024'},
{id: 'integration', name: 'Integration Testing', status: 'Design in Progress', useCasesCompleted: 20, useCasesTotal: 45, agentsCompleted: 5, agentsTotal: 15, agentificationETA: 'Nov 2024'},
{id: 'usability', name: 'Usability Testing', status: 'Design in Progress', useCasesCompleted: 6, useCasesTotal: 20, agentsCompleted: 1, agentsTotal: 6, agentificationETA: 'Dec 2024'},
{id: 'contract', name: 'Contract Testing', status: 'Design in Progress', useCasesCompleted: 15, useCasesTotal: 30, agentsCompleted: 4, agentsTotal: 10, agentificationETA: 'Jan 2025'},
{id: 'guardrail', name: 'Guardrail Testing', status: 'Design in Progress', useCasesCompleted: 18, useCasesTotal: 40, agentsCompleted: 6, agentsTotal: 12, agentificationETA: 'Feb 2025'}
];
this.getTestingScopes = function() {
const stored = LocalStorageService.get(STORAGE_KEY);
const scopes = stored || defaultScopes;
return scopes.map(scope => {
const updated = angular.copy(scope);
updated.progressPercentage = CalculationFactory.calculatePercentage(scope.useCasesCompleted, scope.useCasesTotal);
updated.agentProgressPercentage = CalculationFactory.calculatePercentage(scope.agentsCompleted, scope.agentsTotal);
updated.progressColor = this.getProgressColor(updated.progressPercentage);
return updated;
});
};
this.getProgressColor = function(percentage) {
if (percentage >= 75) return '#4CAF50';
if (percentage >= 50) return '#FF9800';
if (percentage >= 25) return '#FFC107';
return '#F44336';
};
this.updateTestingScopes = function(scopes) {
return LocalStorageService.set(STORAGE_KEY, scopes);
};
this.getInProgressScopes = function() {
return this.getTestingScopes().filter(scope => scope.status === 'In Progress');
};
this.getDesignInProgressScopes = function() {
return this.getTestingScopes().filter(scope => scope.status === 'Design in Progress');
};
}]);
