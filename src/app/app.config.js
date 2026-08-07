angular.module('apbDemo')
.constant('EnvConfig', {
    apiBaseUrl: 'https://api.example.com/credit-card',
    telemetryUrl: 'https://telemetry.example.com',
    loggingLevel: 'INFO'
})
.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self'
    ]);
}]);