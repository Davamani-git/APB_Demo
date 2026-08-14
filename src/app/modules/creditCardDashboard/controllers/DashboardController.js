angular.module('creditCardDashboardModule').controller('DashboardController', ['$scope', 'CreditCardDataService', function($scope, CreditCardDataService) {
  var vm = this;
  
  $scope.summary = null;
  $scope.loading = true;
  $scope.error = null;
  
  $scope.loadDashboard = function() {
    $scope.loading = true;
    $scope.error = null;
    
    CreditCardDataService.getCreditCardSummary()
      .then(function(data) {
        $scope.summary = data;
        $scope.loading = false;
      })
      .catch(function(error) {
        $scope.error = 'Failed to load credit card data. Please try again.';
        $scope.loading = false;
      });
  };
  
  $scope.refreshDashboard = function() {
    $scope.loadDashboard();
  };
  
  $scope.loadDashboard();
}]);