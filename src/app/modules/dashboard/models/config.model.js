(function() {
  'use strict';

  function ConfigModel(data) {
    data = data || {};
    this.currencyCode = data.currencyCode || 'INR';
    this.trendChartType = data.trendChartType || 'line';
    this.summaryChartType = data.summaryChartType || 'bar';
    this.colorPalette = data.colorPalette || ['#0052CC', '#2684FF', '#36B37E', '#FFAB00'];
    this.highSpendThreshold = typeof data.highSpendThreshold === 'number' ? data.highSpendThreshold : 50000;
    this.featureFlags = data.featureFlags || {};
  }

  angular.module('app')
    .factory('ConfigModel', function() {
      return ConfigModel;
    });
})();
