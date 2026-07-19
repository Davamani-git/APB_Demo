(function () {
    "use strict";

    appConfig.$inject = ["$httpProvider"];

    function appConfig($httpProvider) {
        $httpProvider.interceptors.push("HttpInterceptorService");
    }

    angular.module("app")
        .config(appConfig);
}());
