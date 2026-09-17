(function(){
'use strict';
angular.module('fraudAlertApp',['ngRoute','ngResource','fraudAlertModule'])
.constant('API_CONFIG',{baseUrl:'https://api.fraudalert.example.com',transactionsEndpoint:'/api/transactions',alertsEndpoint:'/api/alerts',auditEndpoint:'/api/audit'})
.constant('RISK_API_ENDPOINT','https://api.fraudalert.example.com/api/risk-engine/evaluate')
.constant('AUDIT_API_ENDPOINT','https://api.fraudalert.example.com/api/audit')
.constant('POLICY_CONFIG',{thresholds:{low:25,medium:50,high:75,critical:90}})
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/fraud-alert/views/transaction-dashboard.view.html',controller:'TransactionDashboardController',controllerAs:'vm'})
.when('/transaction/:id',{templateUrl:'src/app/fraud-alert/views/transaction-detail.view.html',controller:'TransactionDetailController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push('HttpInterceptor');
}]);
})();