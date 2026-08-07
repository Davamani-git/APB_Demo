(function() {
    'use strict';
    angular.module('app.creditCardDashboard')
        .directive('portfolioKpiCard', [function() {
            return {
                restrict: 'E',
                scope: {
                    kpiTitle: '@',
                    kpiValue: '=',
                    kpiIcon: '@'
                },
                template: '<div class="kpi-card">' +
                         '<i class="fa kpi-icon" ng-class="kpiIcon"></i>' +
                         '<h3>{{kpiTitle}}</h3>' +
                         '<div class="kpi-value">{{kpiValue | currency}}</div>' +
                         '</div>'
            };
        }]);
})();