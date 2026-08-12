(function(){
'use strict';
angular.module('creditCardApp').constant('API_ENDPOINTS',{baseUrl:'https://api.creditcard.example.com',creditCards:'/api/creditcards',transactions:'/api/transactions'}).config(['$routeProvider',function($routeProvider){$routeProvider.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.html',controller:'dashboardController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});}]);
})();