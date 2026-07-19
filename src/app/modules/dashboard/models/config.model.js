(function() {
  'use strict';

  ConfigModel.$inject = [];

  function ConfigModel() {}

  ConfigModel.prototype.fromResponse = function(data) {
    if (!data) {
      return this;
    }

    this.currencyCode = typeof data.currencyCode === 'string' ? data.currencyCode : '';
    this.trendChartType = typeof data.trendChartType === 'string' ? data.trendChartType : 'line';
    this.summaryChartType = typeof data.summaryChartType === 'string' ? data.summaryChartType : 'bar';
    this.colorPalette = Array.isArray(data.colorPalette) ? data.colorPalette : ['#4CAF50', '#2196F3', '#FFC107'];
    this.highSpendThreshold = typeof data.highSpendThreshold === 'number' ? data.highSpendThreshold : 0;
    this.featureFlags = data.featureFlags && typeof data.featureFlags === 'object' ? data.featureFlags : {};

    return this;
  };

  angular.module('app')
    .factory('ConfigModel', function() {
      return ConfigModel;
    });
})();
