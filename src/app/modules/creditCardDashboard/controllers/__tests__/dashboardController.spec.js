/*
Test Documentation:
- Test Name: DashboardController Initialization
- Purpose: Verify that the DashboardController initializes correctly and loads portfolio data
- Scenario: Controller is instantiated and init() is called automatically
- Expected Result: Loading state is set to true initially, then false after data loads, and portfolioSummary is populated
*/
/*
Test Documentation:
- Test Name: DashboardController Error Handling
- Purpose: Verify that the controller handles service errors gracefully
- Scenario: CreditCardPortfolioService.getPortfolioSummary() rejects with an error
- Expected Result: Error message is set and loading state is set to false
*/
/*
Coverage Report:
- Functions tested: init
- Scenarios covered: successful data load, error handling
- Uncovered scenarios: none
*/

(function() {
    'use strict';

    describe('DashboardController', function() {
        var $controller, $rootScope, $scope, $q, CreditCardPortfolioService, controller;

        beforeEach(module('app.creditCardDashboard'));

        beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            $scope = $rootScope.$new();

            CreditCardPortfolioService = {
                getPortfolioSummary: jasmine.createSpy('getPortfolioSummary')
            };
        }));

        describe('Initialization', function() {
            it('should set loading to true initially', function() {
                var deferred = $q.defer();
                CreditCardPortfolioService.getPortfolioSummary.and.returnValue(deferred.promise);

                controller = $controller('DashboardController', {
                    $scope: $scope,
                    CreditCardPortfolioService: CreditCardPortfolioService
                });

                expect(controller.loading).toBe(true);
                expect(controller.error).toBe(null);
                expect(controller.portfolioSummary).toBe(null);
            });

            it('should call CreditCardPortfolioService.getPortfolioSummary on init', function() {
                var deferred = $q.defer();
                CreditCardPortfolioService.getPortfolioSummary.and.returnValue(deferred.promise);

                controller = $controller('DashboardController', {
                    $scope: $scope,
                    CreditCardPortfolioService: CreditCardPortfolioService
                });

                expect(CreditCardPortfolioService.getPortfolioSummary).toHaveBeenCalled();
            });

            it('should populate portfolioSummary and set loading to false on successful data load', function() {
                var mockData = {
                    totalMonthlySpend: 5000,
                    totalCreditLimit: 20000,
                    totalAvailableCredit: 15000,
                    totalOutstanding: 5000,
                    cards: []
                };
                var deferred = $q.defer();
                CreditCardPortfolioService.getPortfolioSummary.and.returnValue(deferred.promise);

                controller = $controller('DashboardController', {
                    $scope: $scope,
                    CreditCardPortfolioService: CreditCardPortfolioService
                });

                deferred.resolve(mockData);
                $rootScope.$digest();

                expect(controller.portfolioSummary).toEqual(mockData);
                expect($scope.portfolioSummary).toEqual(mockData);
                expect(controller.loading).toBe(false);
                expect(controller.error).toBe(null);
            });
        });

        describe('Error Handling', function() {
            it('should set error message and loading to false on service error', function() {
                var deferred = $q.defer();
                CreditCardPortfolioService.getPortfolioSummary.and.returnValue(deferred.promise);

                controller = $controller('DashboardController', {
                    $scope: $scope,
                    CreditCardPortfolioService: CreditCardPortfolioService
                });

                deferred.reject({ status: 500, message: 'Server Error' });
                $rootScope.$digest();

                expect(controller.error).toBe('Failed to load portfolio data. Please try again later.');
                expect(controller.loading).toBe(false);
                expect(controller.portfolioSummary).toBe(null);
            });
        });
    });
})();