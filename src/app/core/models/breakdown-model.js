(function () {
  'use strict';

  function BreakdownCategory(data) {
    data = data || {};
    this.code = data.code || '';
    this.label = data.label || '';
    this.amount = typeof data.amount === 'number' ? data.amount : 0;
    this.percentage = typeof data.percentage === 'number' ? data.percentage : 0;
  }

  function BreakdownModel(data) {
    data = data || {};
    const categories = Array.isArray(data.categories) ? data.categories : [];
    this.categories = categories.map(function (c) { return new BreakdownCategory(c); });
  }

  angular.module('davmsApp')
    .factory('BreakdownModel', function () {
      return BreakdownModel;
    });
})();
