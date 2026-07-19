(function () {
  'use strict';

  InsightsFormattingService.$inject = ['configService'];

  function InsightsFormattingService(configService) {
    function formatMonthlySummary(rawSummaryModel) {
      var formatted = {
        totalSpend: rawSummaryModel.totalSpend,
        transactionCount: rawSummaryModel.transactionCount,
        averageSpend: rawSummaryModel.averageSpend,
        categories: rawSummaryModel.categories,
        currency: rawSummaryModel.currency,
        month: rawSummaryModel.month
      };
      return formatted;
    }

    function formatSpendingTrends(trendModel) {
      var labels = [];
      var data = [];
      trendModel.points.forEach(function (p) {
        labels.push(p.month);
        data.push(p.totalSpend);
      });
      var chartConfig = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Spend',
            data: data,
            backgroundColor: '#2684FF',
            borderColor: '#0052CC',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true
          },
          tooltips: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                var value = tooltipItem.yLabel;
                return 'Total Spend: ' + Number(value).toFixed(2);
              }
            }
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Total Spend'
              },
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      };
      return chartConfig;
    }

    return {
      formatMonthlySummary: formatMonthlySummary,
      formatSpendingTrends: formatSpendingTrends
    };
  }

  angular.module('app')
    .service('insightsFormattingService', InsightsFormattingService);
})();
