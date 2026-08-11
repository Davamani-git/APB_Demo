(function() {
  'use strict';
  angular.module('financeApp', [
    'ngRoute',
    'app.accounts',
    'app.transactions',
    'app.budgets',
    'app.goals',
    'app.insights',
    'app.nlquery'
  ]);
  angular.module('app.accounts', []);
  angular.module('app.transactions', []);
  angular.module('app.budgets', []);
  angular.module('app.goals', []);
  angular.module('app.insights', []);
  angular.module('app.nlquery', []);
})();