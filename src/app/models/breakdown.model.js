(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('BreakdownModel', BreakdownModelFactory);

  BreakdownModelFactory.$inject = [];

  function BreakdownModelFactory() {
    function BreakdownModel(data) {
      this.month = data && data.month || '';
      this.categories = [];
      if (data && angular.isArray(data.categories)) {
        this.categories = data.categories.map(function (c) {
          return {
            id: c.id || '',
            label: c.label || '',
            amount: typeof c.amount === 'number' ? c.amount : 0,
            percentage: typeof c.percentage === 'number' ? c.percentage : 0
          };
        });
      }
    }

    return BreakdownModel;
  }
})();
