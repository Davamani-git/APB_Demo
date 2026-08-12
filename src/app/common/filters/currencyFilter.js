angular.module('apbApp').filter('portfolioCurrency', function() {
  return function(value, currency) {
    if (value == null || isNaN(value)) { return '-'; }
    var sym = currency === 'EUR' ? '\u20ac' : currency === 'GBP' ? '\u00a3' : '$';
    return sym + Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
});
