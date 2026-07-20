(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('BreakdownModel', BreakdownModelFactory);

  BreakdownModelFactory.$inject = [];

  function BreakdownModelFactory() {
    function BreakdownModel(data) {
      this.month = data.month || '';
      this.categories = [];
      if (angular.isArray(data.categories)) {
        angular.forEach(data.categories, function (item) {
          this.categories.push({
            id: item.id || '',
            label: item.label || '',
            amount: typeof item.amount === 'number' ? item.amount : 0,
            percentage: typeof item.percentage === 'number' ? item.percentage : 0
          });
        }, this);
      }
    }

    return BreakdownModel;
  }
})();
