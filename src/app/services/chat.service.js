(function(){
'use strict';
angular.module('helpCenterApp').factory('ChatService',['$http','$q','$timeout',ChatService]);
function ChatService($http,$q,$timeout){
var service={sendMessage:sendMessage};
return service;
function sendMessage(query){
var deferred=$q.defer();
$timeout(function(){
var response={text:'Here are some resources that might help:',links:[{title:'Getting Started Guide',url:'/articles/quick-start'},{title:'FAQ',url:'/articles/faq'}]};
deferred.resolve(response);
},500);
return deferred.promise;
}
}
})();