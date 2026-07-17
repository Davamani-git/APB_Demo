'use strict';

(function () {
  function brDateFilter($filter) {
    'ngInject';
    return function (value) {
      if (!value) { return ''; }
      return $filter('date')(value, 'mediumDate');
    };
  }

  angular
    .module('davBanking.billReminders')
    .filter('brDate', brDateFilter);
})();
