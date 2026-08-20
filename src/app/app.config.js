(function(){
'use strict';
angular.module('FraudAlertModule').config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/fraud-alert/views/dashboard.view.html',controller:'ActionRouterController',controllerAs:'vm'})
.when('/config',{templateUrl:'src/app/fraud-alert/views/config.view.html',controller:'ThresholdConfigController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push('HttpInterceptor');
}]);
angular.module('FraudAlertModule').factory('HttpInterceptor',['$q','$window',function($q,$window){
return{
request:function(config){
var token=$window.localStorage.getItem('authToken');
if(token){
config.headers.Authorization='Bearer '+token;
}
return config;
},
responseError:function(rejection){
if(rejection.status===401){
$window.location.href='#/login';
}
return $q.reject(rejection);
}
};
}]);
})();