(function(){
'use strict';
angular.module('onlineShoppingApp').service('NotificationService',['$http','$q',function($http,$q){
var API_BASE='/api/notifications';
this.sendNotification=function(userId,type,message){
var deferred=$q.defer();
$http.post(API_BASE+'/send',{userId:userId,type:type,message:message}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();