(function () {
  'use strict';

  angular
    .module('apb.layout')
    .directive('apbHeader', apbHeader);

  function apbHeader() {
    return {
      restrict: 'E',
      template: '<nav class="navbar navbar-inverse">' +
        '<div class="container-fluid">' +
        '<div class="navbar-header">' +
        '<a class="navbar-brand" href="#/dashboard/monthly-spend">Spend Insights</a>' +
        '</div>' +
        '</div>' +
        '</nav>'
    };
  }
})();
