(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .filter('currencyFormat', [function(){
      return function(value, currency){
        if(value === null || value === undefined){
          return '';
        }
        var num = Number(value);
        if(isNaN(num)){
          num = 0;
        }
        var curr = currency || 'INR';
        return curr + ' ' + num.toFixed(2);
      };
    }]);
})();
