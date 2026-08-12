angular.module('apbApp').directive('benchmarkChart', ['analyticsService', function(analyticsService) {
  return {
    restrict: 'E',
    scope: { companyId: '=' },
    template: '<div class="chart-container"><canvas id="benchmarkChart"></canvas></div>',
    link: function(scope, element) {
      var ctx = element.find('canvas')[0].getContext('2d');
      var chart = null;
      scope.$watch('companyId', function(id) {
        if (!id) { return; }
        analyticsService.getTopServices(id, 5).then(function(data) {
          var labels = data.map(function(d){ return d.serviceName; });
          var values = data.map(function(d){ return d.totalCost; });
          if (chart) { chart.destroy(); }
          chart = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'Top Services by Cost', data: values, backgroundColor: '#28a745' }] },
            options: { responsive: true, maintainAspectRatio: false }
          });
        });
      });
    }
  };
}]);
