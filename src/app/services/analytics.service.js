(function(){
'use strict';
angular.module('onlineShoppingApp').service('AnalyticsService',['$http','$q','$cacheFactory',function($http,$q,$cacheFactory){
var API_BASE='/api/analytics';
var cache=$cacheFactory('analyticsCache');
this.getSalesReport=function(sellerId,period){
var cacheKey='sales_'+sellerId+'_'+period;
var cached=cache.get(cacheKey);
if(cached){
var deferred=$q.defer();
deferred.resolve(cached);
return deferred.promise;
}
var deferred=$q.defer();
$http.get(API_BASE+'/sales',{params:{sellerId:sellerId,period:period}}).then(function(response){
cache.put(cacheKey,response.data);
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.getPlatformMetrics=function(){
var cacheKey='platform_metrics';
var cached=cache.get(cacheKey);
if(cached){
var deferred=$q.defer();
deferred.resolve(cached);
return deferred.promise;
}
var deferred=$q.defer();
$http.get(API_BASE+'/platform').then(function(response){
cache.put(cacheKey,response.data);
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.clearCache=function(){
cache.removeAll();
};
}]);
})();