(function() {
  'use strict';

  function summaryKpiCards() {
    return {
      restrict: 'E',
      scope: {
        kpis: '='
      },
      template: [
        '<div class="kpi-cards">',
          '<div class="row">',
            '<div class="col-md-3 col-sm-6" ng-repeat="kpi in kpis">',
              '<div class="kpi-card" ng-style="{\"border-left-color\": kpi.color}">',
                '<h4>',
                  '<i class="glyphicon" ng-class="kpi.icon" ng-if="kpi.icon"></i>',
                  '{{ kpi.label }}',
                '</h4>',
                '<p class="value">',
                  '{{ kpi.value }}',
                  '<span class="unit" ng-if="kpi.unit">{{ kpi.unit }}</span>',
                '</p>',
              '</div>',
            '</div>',
          '</div>',
        '</div>'
      ].join(''),
      link: function(scope, element, attrs) {
        // No additional logic needed for this simple display directive
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('summaryKpiCards', summaryKpiCards);
})();