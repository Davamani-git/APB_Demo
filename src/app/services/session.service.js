(function(){
'use strict';
angular.module('onlineShoppingApp').service('SessionService',['$window','$q',function($window,$q){
var self=this;
this.storeSession=function(token,role,userId){
try{
var session={token:token,role:role,userId:userId,expiresAt:Date.now()+1800000};
$window.localStorage.setItem('session',JSON.stringify(session));
return true;
}catch(e){
return false;
}
};
this.getSession=function(){
try{
var session=JSON.parse($window.localStorage.getItem('session'));
if(session&&session.expiresAt>Date.now()){
return session;
}
this.clearSession();
return null;
}catch(e){
return null;
}
};
this.clearSession=function(){
$window.localStorage.removeItem('session');
};
this.validateSession=function(){
var deferred=$q.defer();
var session=this.getSession();
if(session&&session.token){
deferred.resolve(session);
}else{
deferred.reject('No valid session');
}
return deferred.promise;
};
this.getToken=function(){
var session=this.getSession();
return session?session.token:null;
};
this.getUserId=function(){
var session=this.getSession();
return session?session.userId:null;
};
this.getRole=function(){
var session=this.getSession();
return session?session.role:null;
};
}]);
})();