(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .directive('errorBanner', [function(){
      return {
        restrict: 'E',
        scope: {
          message: '@'
        },
        template: '<div class="alert alert-danger error-banner" ng-if="message">{{message}}</div>'
      };
    }]);
})();
