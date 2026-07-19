(function(window) {
  'use strict';

  window.ConfigMockData = {
    currencyCode: 'INR',
    trendChartType: 'line',
    summaryChartType: 'bar',
    colorPalette: ['#0052CC', '#2684FF', '#36B37E', '#FFAB00', '#DE350B'],
    highSpendThreshold: 50000,
    featureFlags: {
      showCategoryBreakdown: true,
      showAverageSpend: true,
      simulateSummaryError: false,
      simulateTrendError: false
    }
  };
})(window);
