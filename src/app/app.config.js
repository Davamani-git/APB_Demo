(function(){
'use strict';
angular.module('onlineShoppingApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/buyer-orders',{templateUrl:'src/app/orders/views/buyer-orders.html',controller:'BuyerOrderController',controllerAs:'vm',resolve:{auth:['SessionService',function(SessionService){return SessionService.validateSession();}]}})
.when('/seller-dashboard',{templateUrl:'src/app/seller-dashboard/views/seller-dashboard.html',controller:'SellerDashboardController',controllerAs:'vm',resolve:{auth:['SessionService',function(SessionService){return SessionService.validateSession();}]}})
.otherwise({redirectTo:'/buyer-orders'});
$locationProvider.html5Mode(false);
}]);
})();