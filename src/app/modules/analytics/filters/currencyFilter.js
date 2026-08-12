(function(){'use strict';
  angular.module('analytics').filter('apbCurrency', apbCurrencyFilter);
  function apbCurrencyFilter(){
    return function(amount,currency){
      currency=currency||'USD';
      var symbol={'USD':'$','EUR':'€','GBP':'£','INR':'₹'}[currency]||'$';
      return symbol+(amount||0).toFixed(2);
    };
  }
})();
