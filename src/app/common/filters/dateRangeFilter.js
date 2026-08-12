angular.module('apbApp').filter('dateRange', function() {
  return function(items, start, end) {
    if (!angular.isArray(items) || (!start && !end)) { return items; }
    var s = start ? new Date(start).getTime() : -Infinity;
    var e = end ? new Date(end).getTime() : Infinity;
    return items.filter(function(i) {
      var t = new Date(i.date || i.timestamp).getTime();
      return t >= s && t <= e;
    });
  };
});
