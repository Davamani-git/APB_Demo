angular.module('executiveDashboard').controller('DataEditorController', ['$scope', '$rootScope', 'KpiService', 'TestingScopeService', 'CalculationFactory', function($scope, $rootScope, KpiService, TestingScopeService, CalculationFactory) {
const vm = this;
vm.isOpen = false;
vm.editableKpis = [];
vm.editableScopes = [];
vm.open = function() {
const rawKpis = KpiService.getRawKpis();
vm.editableKpis = [
{id: 'totalUseCases', label: 'Total Use Cases', value: rawKpis.totalUseCases},
{id: 'readyUseCases', label: 'Ready Use Cases', value: rawKpis.readyUseCases},
{id: 'totalAgents', label: 'Total Agents', value: rawKpis.totalAgents},
{id: 'agentsInProgress', label: 'Agents In Progress', value: rawKpis.agentsInProgress},
{id: 'totalWorkflows', label: 'Total Workflows', value: rawKpis.totalWorkflows},
{id: 'workflowsCompleted', label: 'Workflows Completed', value: rawKpis.workflowsCompleted},
{id: 'totalApbFlows', label: 'Total APB Flows', value: rawKpis.totalApbFlows},
{id: 'apbFlowsCompleted', label: 'APB Flows Completed', value: rawKpis.apbFlowsCompleted}
];
vm.editableScopes = TestingScopeService.getTestingScopes();
vm.isOpen = true;
};
vm.close = function() {
vm.isOpen = false;
};
vm.save = function() {
if ($scope.dataEditorForm.$invalid) {
alert('Please fill all required fields with valid values');
return;
}
const kpisToSave = {};
vm.editableKpis.forEach(kpi => {
kpisToSave[kpi.id] = kpi.value;
});
KpiService.updateKpis(kpisToSave);
TestingScopeService.updateTestingScopes(vm.editableScopes);
$rootScope.$broadcast('data:updated');
vm.close();
};
$rootScope.$on('dataEditor:open', function() {
vm.open();
});
}]);
