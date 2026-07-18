angular.module('davms.summary').config(appConfig);

appConfig.$inject = ['$httpProvider'];
function appConfig($httpProvider) {
  $httpProvider.interceptors.push('HttpInterceptorFactory');
}