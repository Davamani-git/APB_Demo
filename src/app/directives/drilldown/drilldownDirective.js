(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .directive('drilldownDirective', ['analyticsService', function(analyticsService) {
      return {
        restrict: 'E',
        scope: {
          dataPoint: '='
        },
        templateUrl: 'src/app/directives/drilldown/drilldown.html',
        link: function(scope, element) {
          scope.detailsLoading = false;
          scope.detailsData = null;
          scope.showDetails = function(dataPointId) {
            scope.detailsLoading = true;
            analyticsService.getDrilldownData(dataPointId).then(function(data) {
              scope.detailsData = data;
              scope.detailsLoading = false;
              scope.renderChart(data);
              scope.$apply();
            }).catch(function(error) {
              scope.detailsLoading = false;
              console.error('Failed to load drilldown data:', error);
              scope.$apply();
            });
          };
          scope.renderChart = function(data) {
            var chartContainer = element[0].querySelector('.chart-container');
            if (!chartContainer || !data || !data.values) return;
            d3.select(chartContainer).selectAll('*').remove();
            var width = 400;
            var height = 300;
            var margin = {top: 20, right: 20, bottom: 30, left: 40};
            var svg = d3.select(chartContainer)
              .append('svg')
              .attr('width', width)
              .attr('height', height);
            var x = d3.scaleBand()
              .domain(data.values.map(function(d, i) { return i; }))
              .range([margin.left, width - margin.right])
              .padding(0.1);
            var y = d3.scaleLinear()
              .domain([0, d3.max(data.values)])
              .range([height - margin.bottom, margin.top]);
            svg.selectAll('rect')
              .data(data.values)
              .enter()
              .append('rect')
              .attr('x', function(d, i) { return x(i); })
              .attr('y', function(d) { return y(d); })
              .attr('width', x.bandwidth())
              .attr('height', function(d) { return height - margin.bottom - y(d); })
              .attr('fill', 'steelblue');
          };
          if (scope.dataPoint && scope.dataPoint.id) {
            scope.showDetails(scope.dataPoint.id);
          }
        }
      };
    }]);
})();