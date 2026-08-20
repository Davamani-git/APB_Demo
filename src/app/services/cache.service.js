(function(){
'use strict';
angular.module('FraudAlertModule').factory('CacheService',['$window',CacheService]);
function CacheService($window){
var service={get:get,set:set,remove:remove,clear:clear};
return service;
function get(key){
var item=$window.localStorage.getItem(key);
if(!item)return null;
try{
return JSON.parse(item);
}catch(e){
return item;
}
}
function set(key,value){
try{
$window.localStorage.setItem(key,JSON.stringify(value));
}catch(e){
console.error('Cache set error:',e);
}
}
function remove(key){
$window.localStorage.removeItem(key);
}
function clear(){
$window.localStorage.clear();
}
}
})();