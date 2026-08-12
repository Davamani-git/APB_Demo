(function(){'use strict';
  angular.module('dataInfrastructure').factory('notificationFactory', notificationFactory);
  notificationFactory.$inject = ['$rootScope'];
  function notificationFactory($rootScope){
    return {toast:toast};
    function toast(level,message){
      $rootScope.$broadcast('toast',{level:level,message:message,at:new Date()});
    }
  }
})();
