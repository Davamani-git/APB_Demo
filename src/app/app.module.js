/* Root application module */
(function () {
  'use strict';

  angular.module('rbApp.core', ['ngResource', 'ngSanitize']);
  angular.module('rbApp.insights', ['rbApp.core']);
  angular.module('rbApp.reminders', ['rbApp.core', 'ngRoute']);

  angular.module('rbApp', [
    'ngRoute',
    'rbApp.core',
    'rbApp.insights',
    'rbApp.reminders'
  ]);
})();
