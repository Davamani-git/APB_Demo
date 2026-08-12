(function(){'use strict';
  angular.module('security').directive('rbacShow', rbacShowDirective);
  rbacShowDirective.$inject = ['authorizationService'];
  function rbacShowDirective(authorizationService){
    return {
      restrict:'A',
      link:function(scope,element,attrs){
        var parts=(attrs.rbacShow||'').split(':');
        var resource=parts[0], action=parts[1]||'read';
        authorizationService.canAccess(resource,action).then(function(){
          element.show();
        }).catch(function(){
          element.hide();
        });
      }
    };
  }
})();
