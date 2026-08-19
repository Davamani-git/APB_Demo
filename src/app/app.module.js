(function() {
  'use strict';
  angular.module('fraudAlertApp', ['ngRoute', 'fraudAlert.ingestion', 'fraudAlert.dashboard']);
  angular.module('fraudAlert.ingestion', []);
  angular.module('fraudAlert.dashboard', []);
})();