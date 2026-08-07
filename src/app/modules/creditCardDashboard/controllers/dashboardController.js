(function() {
    'use strict';
    angular.module('app.creditCardDashboard')
        .controller('DashboardController', ['$scope', 'CreditCardPortfolioService', function($scope, CreditCardPortfolioService) {
            const vm = this;
            vm.loading = true;
            vm.error = null;
            vm.portfolioSummary = null;
            vm.init = function() {
                CreditCardPortfolioService.getPortfolioSummary()
                    .then(function(data) {
                        vm.portfolioSummary = data;
                        $scope.portfolioSummary = data;
                        vm.loading = false;
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to load portfolio data. Please try again later.';
                        vm.loading = false;
                    });
            };
            vm.init();
        }]);
})();