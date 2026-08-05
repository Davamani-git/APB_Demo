(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .service('LoggingService', ['$log', function($log){
      this.error = function(tag, err){
        $log.error('[LOG][' + tag + ']', err);
      };
      this.info = function(tag, msg){
        $log.info('[LOG][' + tag + ']', msg);
      };
    }]);
})();
