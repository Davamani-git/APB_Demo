angular.module('apbApp').service('notificationService', function() {
  this.notify = function(type, message) {
    if (window.console) { console.log('[' + type + '] ' + message); }
    this.last = { type: type, message: message, at: new Date() };
  };
  this.success = function(m){ this.notify('success', m); };
  this.error = function(m){ this.notify('error', m); };
  this.warning = function(m){ this.notify('warning', m); };
  this.info = function(m){ this.notify('info', m); };
});
