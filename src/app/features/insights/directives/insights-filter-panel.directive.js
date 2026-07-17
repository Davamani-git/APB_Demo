(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .directive('insightsFilterPanel', insightsFilterPanelDirective);

  function insightsFilterPanelDirective() {
    return {
      restrict: 'E',
      scope: {
        filters: '=',
        onApply: '&',
        onClear: '&'
      },
      template: '\n        <form class="form-inline insights-filter-panel" ng-submit="apply()">\n          <div class="form-group">\n            <label>From</label>\n            <input type="date" class="form-control" ng-model="filters.fromDate">\n          </div>\n          <div class="form-group">\n            <label>To</label>\n            <input type="date" class="form-control" ng-model="filters.toDate">\n          </div>\n          <div class="form-group">\n            <label>Category</label>\n            <input type="text" class="form-control" ng-model="filters.category" placeholder="All">\n          </div>\n          <button type="submit" class="btn btn-primary">Apply</button>\n          <button type="button" class="btn btn-default" ng-click="clear()">Clear</button>\n        </form>\n      ',
      link: function (scope) {
        scope.apply = function () {
          scope.onApply();
        };
        scope.clear = function () {
          scope.onClear();
        };
      }
    };
  }
})();
