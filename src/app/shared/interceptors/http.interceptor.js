(function(){
'use strict';
angular.module('fraudAlertApp').factory('HttpInterceptor',['$q','AuthService','ToastService','AuditLogService',function($q,AuthService,ToastService,AuditLogService){
return{request:function(config){
if(AuthService.isAuthenticated()){
config.headers=config.headers||{};
config.headers.Authorization='Bearer '+AuthService.getToken();
}
return config;
},requestError:function(rejection){
return $q.reject(rejection);
},response:function(response){
return response;
},responseError:function(rejection){
const errorMsg='API Error: '+(rejection.data&&rejection.data.message||rejection.statusText||'Unknown error');
ToastService.error(errorMsg);
AuditLogService.logEvent('api_error',{status:rejection.status,url:rejection.config.url,error:errorMsg});
return $q.reject(rejection);
}};
}]);
})();