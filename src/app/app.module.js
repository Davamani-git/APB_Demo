/* Root AngularJS module definitions */

(function () {
  'use strict';

  angular.module('app.core', [
    'ngRoute',
    'ngAnimate',
    'ngMessages'
  ]);

  angular.module('app.dashboard', [
    'app.core'
  ]);

  angular.module('app', [
    'app.core',
    'app.dashboard'
  ]);
}());
