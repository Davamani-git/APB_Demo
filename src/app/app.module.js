(function(){
'use strict';
angular.module('fraudDetectionModule',['ngRoute','ui.bootstrap','fraudDetection'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$httpProvider.interceptors.push('authInterceptor');
$routeProvider
.when('/dashboard',{templateUrl:'src/app/modules/fraud-detection/views/fraud-dashboard.html',controller:'fraudAlertController',controllerAs:'vm'})
.when('/config',{templateUrl:'src/app/modules/fraud-detection/views/fraud-config.html',controller:'fraudConfigController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]);
})();