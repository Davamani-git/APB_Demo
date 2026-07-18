(function () {
  "use strict";

  config.$inject = ["$httpProvider"];

  function config($httpProvider) {
    // Register HTTP interceptor for telemetry and error handling
    $httpProvider.interceptors.push("httpInterceptor");
  }

  angular
    .module("app")
    .config(config);
})();
