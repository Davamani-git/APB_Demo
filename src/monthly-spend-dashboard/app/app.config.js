(function () {
  "use strict";

  configureHttp.$inject = ["$httpProvider"];

  angular
    .module("app")
    .config(configureHttp);

  function configureHttp($httpProvider) {
    $httpProvider.interceptors.push("HttpConfigInterceptor");
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
  }
}());
