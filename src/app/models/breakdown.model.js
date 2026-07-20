(function () {
  'use strict';

  angular
    .module('apbDemo')
    .factory('BreakdownModel', BreakdownModelFactory);

  BreakdownModelFactory.$inject = [];
  function BreakdownModelFactory() {
    function BreakdownModel(data) {
      data = data || {};
      this.month = data.month || '';
      this.categories = Array.isArray(data.categories) ? data.categories : [];
    }

    return BreakdownModel;
  }
})();
