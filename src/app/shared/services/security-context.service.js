'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .service('SecurityContextService', SecurityContextService);

  SecurityContextService.$inject = ['$q'];

  function SecurityContextService($q) {
    var userContext = {
      user: null,
      roles: [],
      jurisdiction: null,
      consentContext: {}
    };

    var service = {
      initialize: initialize,
      getUser: getUser,
      getRoles: getRoles,
      getJurisdiction: getJurisdiction,
      getConsentContext: getConsentContext
    };

    return service;

    function initialize() {
      // Minimal implementation: in real app, fetch from backend
      var deferred = $q.defer();
      userContext.user = { id: 'anonymous' };
      userContext.roles = ['RETAIL_CUSTOMER'];
      userContext.jurisdiction = 'DEFAULT';
      userContext.consentContext = { insightsProcessing: true };
      deferred.resolve(userContext);
      return deferred.promise;
    }

    function getUser() {
      return userContext.user;
    }

    function getRoles() {
      return userContext.roles;
    }

    function getJurisdiction() {
      return userContext.jurisdiction;
    }

    function getConsentContext() {
      return userContext.consentContext;
    }
  }
})();
