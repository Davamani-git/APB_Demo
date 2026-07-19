(function () {
  "use strict";

  appConfig.$inject = ["$httpProvider", "$sceProvider"];

  function appConfig($httpProvider, $sceProvider) {
    // Enable Strict Contextual Escaping for security
    $sceProvider.enabled(true);

    // Register global HTTP error interceptor
    $httpProvider.interceptors.push("HttpErrorInterceptor");
  }

  angular.module("app")
    .config(appConfig);
})();
