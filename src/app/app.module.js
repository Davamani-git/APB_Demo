(function(){'use strict';
  angular.module('dataInfrastructure', []);
  angular.module('security', []);
  angular.module('admin', ['security']);
  angular.module('analytics', []);
  angular.module('reporting', ['analytics']);
  angular.module('apbApp', ['ngRoute','dataInfrastructure','security','admin','analytics','reporting']);
})();
