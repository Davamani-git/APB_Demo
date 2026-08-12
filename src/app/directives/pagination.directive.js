(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('pagination', function() {
      return {
        restrict: 'E',
        scope: {
          currentPage: '=',
          totalPages: '=',
          onPageChange: '&'
        },
        template: '<ul class="pagination"><li ng-class="{disabled: currentPage === 1}"><a href="" ng-click="goToPage(currentPage - 1)">&laquo;</a></li><li ng-repeat="page in pages" ng-class="{active: page === currentPage}"><a href="" ng-click="goToPage(page)">{{page}}</a></li><li ng-class="{disabled: currentPage === totalPages}"><a href="" ng-click="goToPage(currentPage + 1)">&raquo;</a></li></ul>',
        link: function(scope) {
          scope.$watchGroup(['currentPage', 'totalPages'], function() {
            scope.pages = [];
            var start = Math.max(1, scope.currentPage - 2);
            var end = Math.min(scope.totalPages, scope.currentPage + 2);
            for (var i = start; i <= end; i++) {
              scope.pages.push(i);
            }
          });
          scope.goToPage = function(page) {
            if (page >= 1 && page <= scope.totalPages && page !== scope.currentPage) {
              scope.onPageChange({ page: page });
            }
          };
        }
      };
    });
})();