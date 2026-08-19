angular.module('fraudDetectionApp').service('ChartService', [function() {
  this.prepareLineChartData = function(data, xKey, yKey) {
    return data.map(function(item) {
      return { x: item[xKey], y: item[yKey] };
    });
  };

  this.prepareBarChartData = function(data, labelKey, valueKey) {
    return {
      labels: data.map(function(item) { return item[labelKey]; }),
      values: data.map(function(item) { return item[valueKey]; })
    };
  };

  this.calculatePercentage = function(part, total) {
    return total > 0 ? ((part / total) * 100).toFixed(2) : 0;
  };

  this.aggregateByPeriod = function(data, dateKey, period) {
    var aggregated = {};
    data.forEach(function(item) {
      var date = new Date(item[dateKey]);
      var key;
      if (period === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'hour') {
        key = date.toISOString().split(':')[0];
      } else {
        key = date.toISOString();
      }
      aggregated[key] = (aggregated[key] || 0) + 1;
    });
    return Object.keys(aggregated).map(function(key) {
      return { period: key, count: aggregated[key] };
    });
  };
}]);