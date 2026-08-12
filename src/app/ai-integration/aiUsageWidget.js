angular.module('apbApp').directive('aiUsageWidget', function() {
  return {
    restrict: 'E',
    scope: { companyId: '=' },
    template: '<div class="widget-card"><h4>AI Usage</h4><div class="metric-value">{{usage}}</div><small>{{unit}}</small></div>',
    controller: ['$scope', 'aggregationService', function($scope, aggregationService) {
      $scope.usage = 0;
      $scope.unit = 'units';
      $scope.$watch('companyId', function(id) {
        if (!id) { return; }
        aggregationService.aggregateByService(id).then(function(data) {
          var total = data.reduce(function(sum, item){ return sum + item.totalUsage; }, 0);
          $scope.usage = total.toFixed(2);
        });
      });
    }]
  };
});
