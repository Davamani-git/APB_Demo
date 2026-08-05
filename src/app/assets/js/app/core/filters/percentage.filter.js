(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .filter('percentage', [function(){
      return function(value){
        if(value === null || value === undefined){
          return '';
        }
        var num = Number(value);
        if(isNaN(num)){
          num = 0;
        }
        return (num * 100).toFixed(1) + '%';
      };
    }]);
})();
