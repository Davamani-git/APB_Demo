(function() {
  'use strict';
  angular.module('executiveDashboardApp').directive('etaDisplay', ['$filter', function($filter) {
    return {
      restrict: 'A',
      scope: {
        etaDate: '='
      },
      template: '<span class="eta-label">Agentification ETA:</span> <span>{{formattedEta}}</span>',
      link: function(scope, element, attrs) {
        function updateEta() {
          if (scope.etaDate) {
            var date = new Date(scope.etaDate);
            scope.formattedEta = $filter('date')(date, 'MMM dd, yyyy');
          } else {
            scope.formattedEta = 'Not Set';
          }
        }
        scope.$watch('etaDate', updateEta);
        updateEta();
      }
    };
  }]);
})();