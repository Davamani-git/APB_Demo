(function () {
  'use strict';

  angular.module('app.core')
    .factory('ClientError', [function () {
      function ClientError(props) {
        angular.extend(this, props);
      }
      return ClientError;
    }]);
}());
