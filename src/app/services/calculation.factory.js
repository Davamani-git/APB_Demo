angular.module('executiveDashboard').factory('CalculationFactory', [function() {
return {
calculatePercentage: function(completed, total) {
if (!total || total === 0) return 0;
return Math.round((completed / total) * 100);
},
calculateProgress: function(items) {
if (!items || items.length === 0) return 0;
const totalCompleted = items.reduce((sum, item) => sum + (item.completed || 0), 0);
const totalCount = items.reduce((sum, item) => sum + (item.total || 0), 0);
return this.calculatePercentage(totalCompleted, totalCount);
},
calculateKpiMetrics: function(data) {
const metrics = {};
if (data.kpis) {
metrics.useCasePercentage = this.calculatePercentage(data.kpis.readyUseCases, data.kpis.totalUseCases);
metrics.agentPercentage = this.calculatePercentage(data.kpis.agentsInProgress, data.kpis.totalAgents);
metrics.workflowPercentage = this.calculatePercentage(data.kpis.workflowsCompleted, data.kpis.totalWorkflows);
metrics.apbFlowPercentage = this.calculatePercentage(data.kpis.apbFlowsCompleted, data.kpis.totalApbFlows);
}
return metrics;
},
recalculateMetrics: function(data) {
const updated = angular.copy(data);
if (updated.testingScopes) {
updated.testingScopes.forEach(scope => {
scope.progressPercentage = this.calculatePercentage(scope.useCasesCompleted, scope.useCasesTotal);
scope.agentProgressPercentage = this.calculatePercentage(scope.agentsCompleted, scope.agentsTotal);
});
}
const kpiMetrics = this.calculateKpiMetrics(updated);
Object.assign(updated, kpiMetrics);
return updated;
}
};
}]);
