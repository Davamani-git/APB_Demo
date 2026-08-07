/*
Test Documentation:
- Test Name: TransactionDataService getTransactions
- Purpose: To verify the getTransactions method's success and failure scenarios.
- Scenario: Successfully fetching transactions and handling an HTTP error.
- Expected Result: On success, it resolves the promise with transaction data. On failure, it rejects the promise with a handled error model.
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: Successful API call, failed API call.
- Uncovered scenarios: None.
*/
describe('TransactionDataService', function() {
    var TransactionDataService, $httpBackend, $rootScope, EnvConfig, ErrorHandlerServiceMock;

    beforeEach(module('apbDemo.services'));

    beforeEach(function() {
        EnvConfig = {
            apiBaseUrl: '/api'
        };
        ErrorHandlerServiceMock = {
            handleHttpError: jasmine.createSpy('handleHttpError').and.returnValue({ code: 'SERVER_ERROR', message: 'A server error occurred.' })
        };
        module(function($provide) {
            $provide.constant('EnvConfig', EnvConfig);
            $provide.value('ErrorHandlerService', ErrorHandlerServiceMock);
        });
    });

    beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _$rootScope_) {
        TransactionDataService = _TransactionDataService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch transactions successfully', function() {
        var mockResponse = { transactions: [{ id: 1, amount: 100 }] };
        $httpBackend.whenGET(EnvConfig.apiBaseUrl + '/transactions-fail-mock').respond(200, mockResponse);

        var promise = TransactionDataService.getTransactions({ from: '2023-01-01', to: '2023-01-31' });
        var result;
        promise.then(function(data) {
            result = data;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        expect(result).toEqual(mockResponse.transactions);
    });

    it('should handle error when fetching transactions', function() {
        $httpBackend.whenGET(EnvConfig.apiBaseUrl + '/transactions-fail-mock').respond(500, 'Internal Server Error');

        var promise = TransactionDataService.getTransactions({ from: '2023-01-01', to: '2023-01-31' });
        var errorResult;
        promise.catch(function(error) {
            errorResult = error;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        expect(ErrorHandlerServiceMock.handleHttpError).toHaveBeenCalled();
        expect(errorResult.code).toBe('SERVER_ERROR');
    });
});