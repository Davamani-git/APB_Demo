(function() {
  'use strict';
  angular.module('shoppingPlatform').directive('ratingStars', [function() {
    return {
      restrict: 'E',
      scope: {
        rating: '='
      },
      template: '<span class="rating-stars">' +
        '<span ng-repeat="star in stars track by $index">' +
        '<i class="glyphicon" ng-class="{\'glyphicon-star\': star.filled, \'glyphicon-star-empty\': !star.filled}"></i>' +
        '</span>' +
        '</span>',
      link: function(scope, element, attrs) {
        scope.$watch('rating', function(newVal) {
          scope.stars = [];
          var rating = newVal || 0;
          for (var i = 1; i <= 5; i++) {
            scope.stars.push({ filled: i <= rating });
          }
        });
      }
    };
  }]);
})();