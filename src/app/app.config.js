(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.view.html',controller:'DashboardController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/cards/cards.view.html',controller:'CardsController',controllerAs:'vm'})
.when('/cards/:cardId',{templateUrl:'src/app/cards/card-detail.view.html',controller:'CardDetailController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics.view.html',controller:'AnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$locationProvider.hashPrefix('');
}]);
})();