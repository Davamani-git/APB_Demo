(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('AuditService', AuditService);

  AuditService.$inject = ['AuditEventModel', 'LoggingService', 'StorageService'];
  function AuditService(AuditEventModel, LoggingService, StorageService) {
    var events = [];

    this.logEvent = function(eventType, details) {
      var event = AuditEventModel.create({
        id: generateId(),
        type: eventType,
        timestamp: new Date().toISOString(),
        actor: 'LOCAL_USER',
        payload: details || {}
      });
      events.push(event);
      LoggingService.info('Audit event', event);
    };

    this.getEvents = function() {
      return events.slice();
    };

    this.persistRecentEvents = function() {
      var state = { auditEvents: events.slice() };
      StorageService.saveState(state);
    };

    function generateId() {
      return 'evt-' + Math.random().toString(36).substr(2, 9);
    }
  }
})();
