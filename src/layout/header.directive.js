(function () {
  'use strict';

  angular
    .module('apb.layout')
    .directive('apbHeader', apbHeader);

  function apbHeader() {
    return {
      restrict: 'E',
      template: [
        '<nav class="navbar navbar-inverse">',
        '  <div class="container-fluid">',
        '    <div class="navbar-header">',
        '      <a class="navbar-brand" href="#/dashboard/monthly-spend">Monthly Spend Dashboard</a>',
        '    </div>',
        '  </div>',
        '</nav>'
      ].join('')
    };
  }
})();
