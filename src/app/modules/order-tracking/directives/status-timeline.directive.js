(function() {
  'use strict';
  angular.module('orderTracking')
    .directive('statusTimeline', [function() {
      return {
        restrict: 'E',
        scope: {
          currentStatus: '=',
          statusHistory: '='
        },
        template: '<div class="timeline">' +
          '<div class="timeline-step" ng-repeat="step in steps" ng-class="{completed: step.completed, active: step.active}">' +
          '<div class="timeline-dot">{{step.icon}}</div>' +
          '<div class="timeline-label">{{step.label}}</div>' +
          '<div class="timeline-time" ng-if="step.timestamp">{{step.timestamp | date:"short"}}</div>' +
          '</div>' +
          '</div>',
        link: function(scope) {
          var statusOrder = ['confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
          var statusLabels = {
            confirmed: 'Confirmed',
            preparing: 'Preparing',
            ready: 'Ready',
            picked_up: 'Picked Up',
            delivered: 'Delivered'
          };
          var statusIcons = {
            confirmed: '✓',
            preparing: '🍳',
            ready: '✓',
            picked_up: '🚗',
            delivered: '✓'
          };
          function updateTimeline() {
            var currentIndex = statusOrder.indexOf(scope.currentStatus);
            scope.steps = statusOrder.map(function(status, index) {
              var historyItem = (scope.statusHistory || []).find(function(h) { return h.status === status; });
              return {
                label: statusLabels[status],
                icon: statusIcons[status],
                completed: index < currentIndex,
                active: index === currentIndex,
                timestamp: historyItem ? historyItem.timestamp : null
              };
            });
          }
          scope.$watch('currentStatus', updateTimeline);
          scope.$watch('statusHistory', updateTimeline, true);
          updateTimeline();
        }
      };
    }]);
})();