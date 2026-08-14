angular.module('creditCardDashboardModule').directive('kpiCard', [function() {
  return {
    restrict: 'E',
    scope: {
      title: '@',
      value: '@',
      icon: '@'
    },
    template: '<div class="kpi-card panel panel-default">' +
              '  <div class="panel-body">' +
              '    <div class="kpi-icon"><i class="glyphicon" ng-class="icon"></i></div>' +
              '    <div class="kpi-content">' +
              '      <h4 class="kpi-title">{{title}}</h4>' +
              '      <p class="kpi-value">{{value}}</p>' +
              '    </div>' +
              '  </div>' +
              '</div>'
  };
}]);