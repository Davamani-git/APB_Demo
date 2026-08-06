(function() {
  'use strict';
  angular.module('executiveDashboardApp').directive('statusGroupTile', function() {
    return {
      restrict: 'A',
      scope: {
        scopeData: '='
      },
      template: '<div class="testing-scope-tile"><div class="scope-header"><span class="scope-name">{{scopeData.scopeName}}</span><span class="scope-status" ng-class="\'status-\' + scopeData.status.replace(\' \', \'\')" ng-style="statusStyle">{{scopeData.status}}</span></div><div class="progress-section"><div class="progress-label"><span>Use Cases</span><span>{{scopeData.useCaseCompleted}}/{{scopeData.useCaseTotal}} ({{scopeData.useCasePercentage}}%)</span></div><div progress-bar completed="scopeData.useCaseCompleted" total="scopeData.useCaseTotal"></div></div><div class="progress-section"><div class="progress-label"><span>Agents</span><span>{{scopeData.agentCompleted}}/{{scopeData.agentTotal}} ({{scopeData.agentPercentage}}%)</span></div><div progress-bar completed="scopeData.agentCompleted" total="scopeData.agentTotal"></div></div><div class="eta-display" eta-display eta-date="scopeData.eta"></div></div>',
      link: function(scope, element, attrs) {
        scope.statusStyle = {};
      }
    };
  });
})();