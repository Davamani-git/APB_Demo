angular.module('fraudDetectionModule').directive('fraudMetricsWidget', ['analyticsService', function(analyticsService) {
  return {
    restrict: 'E',
    scope: {
      refreshInterval: '@'
    },
    templateUrl: 'src/app/fraud-detection/views/fraud-metrics-widget.html',
    link: function(scope, element, attrs) {
      scope.metrics = {
        approve: 0,
        alert: 0,
        hold: 0,
        decline: 0
      };
      scope.loading = true;
      scope.loadMetrics = function() {
        scope.loading = true;
        analyticsService.getMetrics().then(function(data) {
          scope.metrics = {
            approve: data.approveCount || 0,
            alert: data.alertCount || 0,
            hold: data.holdCount || 0,
            decline: data.declineCount || 0
          };
          scope.loading = false;
        }).catch(function(error) {
          console.error('Failed to load widget metrics:', error);
          scope.loading = false;
        });
      };
      scope.loadMetrics();
      var interval = parseInt(scope.refreshInterval) || 30000;
      var timer = setInterval(function() {
        scope.$apply(function() {
          scope.loadMetrics();
        });
      }, interval);
      scope.$on('$destroy', function() {
        clearInterval(timer);
      });
    }
  };
}]);