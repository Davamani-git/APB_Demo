(function () {
    'use strict';

    appConfig.$inject = ['$httpProvider'];

    angular
        .module('app')
        .config(appConfig);

    function appConfig($httpProvider) {
        $httpProvider.interceptors.push('HttpInterceptorService');
    }
})();
