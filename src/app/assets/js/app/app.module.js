(function(){
  'use strict';
  angular.module('appmrn25.shared', []);
  angular.module('appmrn25.dashboard', ['appmrn25.shared']);
  angular.module('appmrn25DashboardApp', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'appmrn25.shared',
    'appmrn25.dashboard'
  ]);
})();
