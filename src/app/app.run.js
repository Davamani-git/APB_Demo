angular.module('davms.summary').run(appRun);

appRun.$inject = ['AuthContextService', 'ConfigService'];
function appRun(AuthContextService, ConfigService) {
  AuthContextService.initializeSession();
  ConfigService.loadEnvironmentConfig();
}