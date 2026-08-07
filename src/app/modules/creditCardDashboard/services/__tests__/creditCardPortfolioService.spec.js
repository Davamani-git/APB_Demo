/*
Test Documentation:
- Test Name: CreditCardPortfolioService getPortfolioSummary
- Purpose: Verify that the service fetches portfolio data correctly with proper authorization
- Scenario: Service method is called and returns data from API
- Expected Result: HTTP GET request is made with correct headers and data is returned
*/
/*
Test Documentation:
- Test Name: CreditCardPortfolioService Cache Mechanism
- Purpose: Verify that the service caches data and returns cached data within cache duration
- Scenario: Service method is called twice within cache duration
- Expected Result: HTTP request is made only once, second call returns cached data
*/
/*
Test Documentation:
- Test Name: CreditCardPortfolioService availableCredit Calculation
- Purpose: Verify that the service calculates availableCredit when not provided
- Scenario: API returns cards without availableCredit field
- Expected Result: availableCredit is calculated as creditLimit - outstandingAmount
*/
/*
Test Documentation:
- Test Name: CreditCardPortfolioService Error Handling
- Purpose: Verify that the service handles HTTP errors correctly
- Scenario: HTTP request fails with error
- Expected Result: Promise is rejected and error is logged
*/
/*
Test Documentation:
- Test Name: CreditCardPortfolioService clearCache
- Purpose: Verify that clearCache method resets cache
- Scenario: clearCache is called after data is cached
- Expected Result: Next call to getPortfolioSummary makes a new HTTP request
*/
/*
Coverage Report:
- Functions tested: getPortfolioSummary, clearCache
- Scenarios covered: successful data fetch, caching, cache expiration, availableCredit calculation, error handling, cache clearing
- Uncovered scenarios: none
*/

(function() {
    'use strict';

    describe('CreditCardPortfolioService', function() {
        var CreditCardPortfolioService, $httpBackend, $q, AuthFactory, $rootScope;
        var mockToken = 'test-token-123';
        var apiUrl = '/api/creditcards/portfolio';

        beforeEach(module('app.creditCardDashboard'));

        beforeEach(function() {
            module(function($provide) {
                AuthFactory = {
                    getAuthToken: jasmine.createSpy('getAuthToken').and.returnValue(mockToken)
                };
                $provide.value('AuthFactory', AuthFactory);
            });
        });

        beforeEach(inject(function(_CreditCardPortfolioService_, _$httpBackend_, _$q_, _$rootScope_) {
            CreditCardPortfolioService = _CreditCardPortfolioService_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
            CreditCardPortfolioService.clearCache();
        });

        describe('getPortfolioSummary', function() {
            it('should fetch portfolio data with correct authorization header', function() {
                var mockData = {
                    totalMonthlySpend: 5000,
                    totalCreditLimit: 20000,
                    totalAvailableCredit: 15000,
                    totalOutstanding: 5000,
                    cards: []
                };

                $httpBackend.expectGET(apiUrl, function(headers) {
                    return headers['Authorization'] === 'Bearer ' + mockToken;
                }).respond(200, mockData);

                var result;
                CreditCardPortfolioService.getPortfolioSummary().then(function(data) {
                    result = data;
                });

                $httpBackend.flush();

                expect(result).toEqual(mockData);
                expect(AuthFactory.getAuthToken).toHaveBeenCalled();
            });

            it('should calculate availableCredit when not provided in response', function() {
                var mockData = {
                    totalMonthlySpend: 5000,
                    totalCreditLimit: 20000,
                    totalAvailableCredit: 15000,
                    totalOutstanding: 5000,
                    cards: [
                        {
                            cardType: 'Visa',
                            cardNumber: '****1234',
                            creditLimit: 10000,
                            outstandingAmount: 3000
                        },
                        {
                            cardType: 'MasterCard',
                            cardNumber: '****5678',
                            creditLimit: 15000,
                            outstandingAmount: 5000,
                            availableCredit: 10000
                        }
                    ]
                };

                $httpBackend.expectGET(apiUrl).respond(200, mockData);

                var result;
                CreditCardPortfolioService.getPortfolioSummary().then(function(data) {
                    result = data;
                });

                $httpBackend.flush();

                expect(result.cards[0].availableCredit).toBe(7000);
                expect(result.cards[1].availableCredit).toBe(10000);
            });

            it('should handle null availableCredit and calculate it', function() {
                var mockData = {
                    cards: [
                        {
                            cardType: 'Visa',
                            cardNumber: '****1234',
                            creditLimit: 10000,
                            outstandingAmount: 3000,
                            availableCredit: null
                        }
                    ]
                };

                $httpBackend.expectGET(apiUrl).respond(200, mockData);

                var result;
                CreditCardPortfolioService.getPortfolioSummary().then(function(data) {
                    result = data;
                });

                $httpBackend.flush();

                expect(result.cards[0].availableCredit).toBe(7000);
            });

            it('should handle error responses correctly', function() {
                spyOn(console, 'error');

                $httpBackend.expectGET(apiUrl).respond(500, 'Internal Server Error');

                var error;
                CreditCardPortfolioService.getPortfolioSummary().catch(function(err) {
                    error = err;
                });

                $httpBackend.flush();

                expect(error).toBeDefined();
                expect(error.status).toBe(500);
                expect(console.error).toHaveBeenCalled();
            });
        });

        describe('Caching Mechanism', function() {
            it('should cache data and return cached data on subsequent calls within cache duration', function() {
                var mockData = {
                    totalMonthlySpend: 5000,
                    cards: []
                };

                $httpBackend.expectGET(apiUrl).respond(200, mockData);

                var result1, result2;
                CreditCardPortfolioService.getPortfolioSummary().then(function(data) {
                    result1 = data;
                });

                $httpBackend.flush();

                CreditCardPortfolioService.getPortfolioSummary().then(function(data) {
                    result2 = data;
                });

                $rootScope.$digest();

                expect(result1).toEqual(mockData);
                expect(result2).toEqual(mockData);
                expect(result1).toBe(result2);
            });

            it('should make new request after cache expires', function() {
                jasmine.clock().install();

                var mockData = { cards: [] };

                $httpBackend.expectGET(apiUrl).respond(200, mockData);

                CreditCardPortfolioService.getPortfolioSummary();
                $httpBackend.flush();

                jasmine.clock().tick(6 * 60 * 1000);

                $httpBackend.expectGET(apiUrl).respond(200, mockData);

                CreditCardPortfolioService.getPortfolioSummary();
                $httpBackend.flush();

                jasmine.clock().uninstall();
            });
        });

        describe('clearCache', function() {
            it('should clear cached data and force new request', function() {
                var mockData = { cards: [] };

                $httpBackend.expectGET(apiUrl).respond(200, mockData);
                CreditCardPortfolioService.getPortfolioSummary();
                $httpBackend.flush();

                CreditCardPortfolioService.clearCache();

                $httpBackend.expectGET(apiUrl).respond(200, mockData);
                CreditCardPortfolioService.getPortfolioSummary();
                $httpBackend.flush();
            });
        });
    });
})();