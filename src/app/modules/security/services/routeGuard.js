(function(){'use strict';
  angular.module('security').service('routeGuard', routeGuard);
  routeGuard.$inject = ['authorizationService','$location','$q'];
  function routeGuard(authorizationService,$location,$q){
    var self=this;
    self.checkAccess=checkAccess;
    function checkAccess(resource,action){
      return authorizationService.canAccess(resource,action).catch(function(){
        $location.path('/access-denied');
        return $q.reject();
      });
    }
  }
})();
