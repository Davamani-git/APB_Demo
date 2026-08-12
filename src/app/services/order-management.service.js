(function(){
'use strict';
angular.module('onlineShoppingApp').service('OrderManagementService',['$http','$q','NotificationService',function($http,$q,NotificationService){
var API_BASE='/api/orders';
this.getOrdersByBuyer=function(buyerId){
var deferred=$q.defer();
$http.get(API_BASE+'/buyer/'+buyerId).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.getOrdersBySeller=function(sellerId){
var deferred=$q.defer();
$http.get(API_BASE+'/seller/'+sellerId).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.cancelOrder=function(orderId,userId){
var deferred=$q.defer();
var self=this;
$http.post(API_BASE+'/'+orderId+'/cancel',{}).then(function(response){
NotificationService.sendNotification(userId,'order_cancelled','Your order has been cancelled').then(function(){
deferred.resolve(response.data);
},function(){
deferred.resolve(response.data);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.updateOrderStatus=function(orderId,status){
var deferred=$q.defer();
$http.put(API_BASE+'/'+orderId+'/status',{status:status}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.getOrderTracking=function(orderId){
var deferred=$q.defer();
$http.get(API_BASE+'/'+orderId+'/tracking').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();