(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .directive('riskBadge', [function() {
      return {
        restrict: 'E',
        scope: {
          level: '@'
        },
        template: '<span class="label label-{{badgeClass}}">{{displayText}}</span>',
        link: function(scope, element, attrs) {
          scope.$watch('level', function(newLevel) {
            const config = {
              low: { class: 'success', text: 'Low Risk' },
              medium: { class: 'warning', text: 'Medium Risk' },
              high: { class: 'danger', text: 'High Risk' },
              confirmed_fraud: { class: 'danger', text: 'Confirmed Fraud' }
            };
            
            const levelConfig = config[newLevel] || { class: 'default', text: 'Unknown' };
            scope.badgeClass = levelConfig.class;
            scope.displayText = levelConfig.text;
          });
        }
      };
    }]);
})();