(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .factory('AuditEventModel', AuditEventModel);

  function AuditEventModel() {
    var prototype = {
      id: null,
      type: '',
      timestamp: null,
      actor: 'LOCAL_USER',
      payload: {}
    };

    return {
      create: function(data) {
        var event = angular.copy(prototype);
        angular.extend(event, data || {});
        return event;
      }
    };
  }
})();
