angular.module('app', ['ngRoute', 'app.wearables'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
$routeProvider
.when('/dashboard', {
templateUrl: 'src/app/wearables/views/activity-dashboard.html',
controller: 'ActivityDashboardController',
controllerAs: 'vm'
})
.when('/pairing', {
templateUrl: 'src/app/wearables/views/device-pairing.html',
controller: 'DevicePairingController',
controllerAs: 'vm'
})
.otherwise({
redirectTo: '/dashboard'
});
}]);
angular.module('app.wearables', []);