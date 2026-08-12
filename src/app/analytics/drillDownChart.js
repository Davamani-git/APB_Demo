angular.module('apbApp').directive('drillDownChart', ['analyticsService', function(analyticsService) {
  return {
    restrict: 'E',
    scope: { companyId: '=' },
    template: '<div class="chart-container"><canvas id="drillDownChart"></canvas></div>',
    link: function(scope, element) {
      var ctx = element.find('canvas')[0].getContext('2d');
      var chart = null;
      scope.$watch('companyId', function(id) {
        if (!id) { return; }
        analyticsService.getTrends(id, 30).then(function(data) {
          var labels = data.map(function(d){ return d.date; });
          var values = data.map(function(d){ return d.cost; });
          if (chart) { chart.destroy(); }
          chart = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'Cost Trend', data: values, borderColor: '#007bff', fill: false }] },
            options: { responsive: true, maintainAspectRatio: false }
          });
        });
      });
    }
  };
}]);
