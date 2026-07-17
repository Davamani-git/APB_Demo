(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .directive('rbPagination', paginationDirective);

  function paginationDirective() {
    return {
      restrict: 'E',
      scope: {
        page: '=',
        pageSize: '=',
        totalItems: '=',
        onPageChange: '&'
      },
      template: '<ul class="pagination" ng-if="totalPages() > 1">' +
        '<li ng-class="{disabled: page <= 1}"><a href="" ng-click="setPage(page - 1)">&laquo;</a></li>' +
        '<li ng-repeat="p in pages()" ng-class="{active: p === page}"><a href="" ng-click="setPage(p)">{{p}}</a></li>' +
        '<li ng-class="{disabled: page >= totalPages()}"><a href="" ng-click="setPage(page + 1)">&raquo;</a></li>' +
        '</ul>',
      link: function (scope) {
        scope.totalPages = function () {
          if (!scope.totalItems || !scope.pageSize) {
            return 0;
          }
          return Math.ceil(scope.totalItems / scope.pageSize);
        };

        scope.pages = function () {
          const pages = [];
          for (let i = 1; i <= scope.totalPages(); i++) {
            pages.push(i);
          }
          return pages;
        };

        scope.setPage = function (p) {
          if (p < 1 || p > scope.totalPages()) {
            return;
          }
          scope.page = p;
          scope.onPageChange({ page: p });
        };
      }
    };
  }
})();
