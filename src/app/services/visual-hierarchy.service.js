angular.module('executiveDashboard').service('VisualHierarchyService', [function() {
const priorityElements = [
{elementId: 'kpi-section', priority: 1, visibleAboveFold: true},
{elementId: 'testing-scope-section', priority: 2, visibleAboveFold: true},
{elementId: 'status-group-inProgress', priority: 3, visibleAboveFold: true},
{elementId: 'status-group-designInProgress', priority: 4, visibleAboveFold: false}
];
this.getAboveFoldElements = function() {
return priorityElements.filter(el => el.visibleAboveFold);
};
this.getBelowFoldElements = function() {
return priorityElements.filter(el => !el.visibleAboveFold);
};
this.getPriorityElements = function() {
return priorityElements.sort((a, b) => a.priority - b.priority);
};
}]);
