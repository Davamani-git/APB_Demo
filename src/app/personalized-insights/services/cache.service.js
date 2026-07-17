'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.services')
    .service('CacheService', CacheService);

  CacheService.$inject = ['$window'];

  function CacheService($window) {
    var storage = $window.sessionStorage || $window.localStorage;

    this.set = function (key, value) {
      try {
        storage.setItem(key, angular.toJson(value));
      } catch (e) {
        // ignore storage errors
      }
    };

    this.get = function (key) {
      try {
        var item = storage.getItem(key);
        return item ? angular.fromJson(item) : null;
      } catch (e) {
        return null;
      }
    };

    this.clear = function (key) {
      try {
        storage.removeItem(key);
      } catch (e) {
        // ignore
      }
    };
  }
})();
