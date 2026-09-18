(function() {
  'use strict';
  angular.module('dashboardModule').directive('alertWidget', ['analyticsService', function(analyticsService) {
    return {
      restrict: 'E',
      scope: {
        company: '='
      },
      template: '<div class="alert" ng-class="alertClass" ng-if="hasAlert"><strong>{{alertTitle}}</strong> {{alertMessage}}</div>',
      link: function(scope, element, attrs) {
        scope.$watch('company', function(company) {
          if (!company) return;
          scope.hasAlert = false;
          if (company.alertStatus === 'budget_exceeded') {
            scope.hasAlert = true;
            scope.alertClass = 'alert-danger';
            scope.alertTitle = 'Budget Alert:';
            scope.alertMessage = 'Spending has exceeded budget threshold';
          } else if (!company.isDataFresh) {
            scope.hasAlert = true;
            scope.alertClass = 'alert-warning';
            scope.alertTitle = 'Data Freshness:';
            scope.alertMessage = 'Data is older than 24 hours';
          }
        }, true);
      }
    };
  }]);
})();