(function() {
  'use strict';
  angular.module('spendingAnalytics').directive('cardComparison', function() {
    return {
      restrict: 'A',
      scope: {
        cardPerformance: '=',
        selectedCard: '=',
        onSelect: '&'
      },
      template: '<div class="card-comparison-container">' +
                '  <table class="table table-striped table-hover">' +
                '    <thead>' +
                '      <tr>' +
                '        <th>Card Name</th>' +
                '        <th>Total Spend</th>' +
                '        <th>Avg Monthly Spend</th>' +
                '        <th>Trend</th>' +
                '        <th>Utilization</th>' +
                '      </tr>' +
                '    </thead>' +
                '    <tbody>' +
                '      <tr ng-repeat="card in cardPerformance" ng-click="selectCard(card.cardId)" ng-class="{\"active\": selectedCard === card.cardId}">' +
                '        <td>{{card.cardName}}</td>' +
                '        <td>₹{{card.totalSpend | number:2}}</td>' +
                '        <td>₹{{card.averageMonthlySpend | number:2}}</td>' +
                '        <td>' +
                '          <span ng-if="card.trendDirection === \"increasing\"" class="trend-up">↑ Increasing</span>' +
                '          <span ng-if="card.trendDirection === \"decreasing\"" class="trend-down">↓ Decreasing</span>' +
                '          <span ng-if="card.trendDirection === \"stable\"" class="trend-stable">→ Stable</span>' +
                '        </td>' +
                '        <td>{{card.utilizationRate | number:1}}%</td>' +
                '      </tr>' +
                '    </tbody>' +
                '  </table>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.selectCard = function(cardId) {
          scope.onSelect({cardId: cardId});
        };
      }
    };
  });
})();