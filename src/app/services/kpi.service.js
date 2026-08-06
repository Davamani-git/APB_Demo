angular.module('executiveDashboard').service('KpiService', ['LocalStorageService', 'CalculationFactory', function(LocalStorageService, CalculationFactory) {
const STORAGE_KEY = 'dashboard.kpis';
const defaultKpis = {
totalUseCases: 250,
readyUseCases: 180,
totalAgents: 150,
agentsInProgress: 95,
totalWorkflows: 80,
workflowsCompleted: 62,
totalApbFlows: 45,
apbFlowsCompleted: 38,
agentificationETA: 'Q2 2024'
};
this.getKpis = function() {
const stored = LocalStorageService.get(STORAGE_KEY);
const kpis = stored || defaultKpis;
const metrics = CalculationFactory.calculateKpiMetrics({kpis: kpis});
return [
{id: 'useCases', label: 'Testing Use Cases', value: kpis.readyUseCases + '/' + kpis.totalUseCases, subtitle: 'Ready', percentage: metrics.useCasePercentage, progressColor: '#4CAF50'},
{id: 'agents', label: 'Overall Agents', value: kpis.agentsInProgress + '/' + kpis.totalAgents, subtitle: 'In Progress', percentage: metrics.agentPercentage, progressColor: '#2196F3'},
{id: 'workflows', label: 'Workflows', value: kpis.workflowsCompleted + '/' + kpis.totalWorkflows, subtitle: 'Completed', percentage: metrics.workflowPercentage, progressColor: '#FF9800'},
{id: 'apbFlows', label: 'APB Flows', value: kpis.apbFlowsCompleted + '/' + kpis.totalApbFlows, subtitle: 'Completed', percentage: metrics.apbFlowPercentage, progressColor: '#9C27B0'}
];
};
this.updateKpis = function(kpis) {
return LocalStorageService.set(STORAGE_KEY, kpis);
};
this.getRawKpis = function() {
return LocalStorageService.get(STORAGE_KEY) || defaultKpis;
};
}]);
