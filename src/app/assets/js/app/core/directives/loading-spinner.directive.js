(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .directive('loadingSpinner', [function(){
      return {
        restrict: 'E',
        scope: {
          loading: '='
        },
        template: '<div class="loading-overlay" ng-if="loading"><span class="glyphicon glyphicon-refresh glyphicon-spin"></span></div>'
      };
    }]);
})();
