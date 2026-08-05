(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .directive('monthlySpendChart', ['TransactionDataService', function(TransactionDataService){
      return {
        restrict: 'E',
        scope: {
          summary: '='
        },
        templateUrl: 'src/app/assets/js/app/dashboard/templates/partials/monthly-spend-chart.html',
        link: function(scope){
          scope.$watch('summary', function(newVal){
            scope.series = TransactionDataService.buildMonthlySpendSeries(newVal);
          });
        }
      };
    }]);
})();
