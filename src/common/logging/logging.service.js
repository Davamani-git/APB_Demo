angular.module('davms.summary').service('LoggingService', LoggingService);

LoggingService.$inject = ['$injector', 'ConfigService'];
function LoggingService($injector, ConfigService) {
  const buffer = [];

  this.info = function(message, context) {
    log('INFO', message, context);
  };

  this.warn = function(message, context) {
    log('WARN', message, context);
  };

  this.error = function(message, context) {
    log('ERROR', message, context);
  };

  this.flush = function() {
    if (!ConfigService.useMockData() && buffer.length) {
      const $http = $injector.get('$http');
      const url = ConfigService.getApiBaseUrl() + '/client-log';
      return $http.post(url, { entries: buffer.slice() })
        .finally(function() {
          buffer.length = 0;
        });
    }
    return Promise.resolve();
  };

  function log(level, message, context) {
    const entry = {
      level: level,
      message: message,
      context: context || {},
      timestamp: Date.now()
    };
    
    console[level === 'ERROR' ? 'error' : 'log'](entry);
    buffer.push(entry);
  }
}