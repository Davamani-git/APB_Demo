angular.module('apbApp').controller('loginController', ['$location', 'authenticationService', 'ssoAuthService', 'notificationService', function($location, authenticationService, ssoAuthService, notificationService) {
  var vm = this;
  vm.loginWithSSO = function() {
    ssoAuthService.redirectToProvider();
  };
  if ($location.search().code) {
    authenticationService.login().then(function() {
      notificationService.success('Login successful');
      $location.path('/dashboard').search('code', null);
    }, function(err) {
      notificationService.error('Login failed: ' + (err || 'unknown'));
    });
  }
}]);
