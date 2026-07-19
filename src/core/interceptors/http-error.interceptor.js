(function () {
  "use strict";

  HttpErrorInterceptor.$inject = ["$q", "LoggingService"];

  function HttpErrorInterceptor($q, LoggingService) {
    return {
      responseError: function (rejection) {
        LoggingService.error("HTTP error", rejection);
        return $q.reject(rejection);
      }
    };
  }

  angular.module("app")
    .factory("HttpErrorInterceptor", HttpErrorInterceptor);
})();
