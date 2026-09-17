(function(){
'use strict';
angular.module('fraudAlertApp').service('AuthService',[function(){
const self=this;
self.getToken=function(){
return localStorage.getItem('auth_token')||'mock-jwt-token-12345';
};
self.setToken=function(token){
localStorage.setItem('auth_token',token);
};
self.clearToken=function(){
localStorage.removeItem('auth_token');
};
self.isAuthenticated=function(){
return!!self.getToken();
};
}]);
})();