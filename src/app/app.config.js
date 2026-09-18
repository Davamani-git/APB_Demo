(function(){
'use strict';
angular.module('helpCenterApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider.when('/',{templateUrl:'src/app/home/home.view.html',controller:'HomeController',controllerAs:'vm'}).when('/help-center',{templateUrl:'src/app/help-center/help-center.view.html',controller:'HelpCenterController',controllerAs:'vm'}).otherwise({redirectTo:'/'});
$locationProvider.hashPrefix('');
}]);
})();