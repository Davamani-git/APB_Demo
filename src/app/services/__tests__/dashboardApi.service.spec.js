describe('DashboardApiService', function() {
    var DashboardApiService;
    var ENV_CONFIG;
    var HttpErrorFactoryMock;
    var LoggingServiceMock;
    var $injectorMock;
    var MonthlySummaryMockServiceMock;
    var MonthlySummaryModelMock;
    var KpiSummaryModelMock;
    var BreakdownItemModelMock;
    var $httpMock;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        ENV_CONFIG = {
            apiBaseUrl: '/api',
            apiTimeoutMs: 15000,
            useMockData: true
        };
        HttpErrorFactoryMock = {
            fromHttpResponse: jasmine.createSpy('fromHttpResponse').and.callFake(function(resp) {
                return { code: 'ERROR', message: 'Error', correlationId: '', details: '', resp: resp };
            })
        };
        LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['info', 'warn', 'error', 'audit']);
        $httpMock = jasmine.createSpy('$http');
        $injectorMock = jasmine.createSpyObj('$injector', ['get']);
        MonthlySummaryMockServiceMock = jasmine.createSpyObj('MonthlySummaryMockService', ['getMonthlySummary']);
        MonthlySummaryModelMock = function(dto) { this.dto = dto; };
        KpiSummaryModelMock = function(dto) { this.dto = dto; };
        BreakdownItemModelMock = function(dto) { this.dto = dto; };

        $injectorMock.get.and.callFake(function(token) {
            if (token === '$http') {
                return $httpMock;
            }
            return null;
        });

        $provide.value('ENV_CONFIG', ENV_CONFIG);
        $provide.value('HttpErrorFactory', HttpErrorFactoryMock);
        $provide.value('LoggingService', LoggingServiceMock);
        $provide.value('$injector', $injectorMock);
        $provide.value('MonthlySummaryMockService', MonthlySummaryMockServiceMock);
        $provide.value('MonthlySummaryModel', MonthlySummaryModelMock);
        $provide.value('KpiSummaryModel', KpiSummaryModelMock);
        $provide.value('BreakdownItemModel', BreakdownItemModelMock);
    }));

    beforeEach(inject(function(_DashboardApiService_) {
        DashboardApiService = _DashboardApiService_;
    }));

    it('should reject when cardId is empty or whitespace', function(done) {
        // Arrange
        var promise = DashboardApiService.getMonthlySummary('   ', '2026-07');

        // Act / Assert
        promise.catch(function(errorModel) {
            expect(errorModel.code).toBe('ERROR');
            expect(HttpErrorFactoryMock.fromHttpResponse).toHaveBeenCalled();
            done();
        });
    });

    it('should reject when month format is invalid', function(done) {
        // Arrange
        var promise = DashboardApiService.getMonthlySummary('CARD123', 'invalid');

        // Act / Assert
        promise.catch(function(errorModel) {
            expect(errorModel.code).toBe('ERROR');
            expect(HttpErrorFactoryMock.fromHttpResponse).toHaveBeenCalled();
            done();
        });
    });

    it('should use mock data when ENV_CONFIG.useMockData is true', function(done) {
        // Arrange
        ENV_CONFIG.useMockData = true;
        var mockResult = { summary: {}, kpis: [], breakdown: [] };
        MonthlySummaryMockServiceMock.getMonthlySummary.and.returnValue(Promise.resolve(mockResult));

        // Act
        var promise = DashboardApiService.getMonthlySummary('CARD123', '2026-07');

        // Assert
        promise.then(function(result) {
            expect(LoggingServiceMock.info).toHaveBeenCalledWith('Using mock data for monthly summary', jasmine.objectContaining({ route: undefined, cardId: jasmine.any(String), month: '2026-07' }));
            expect(MonthlySummaryMockServiceMock.getMonthlySummary).toHaveBeenCalledWith('CARD123', '2026-07');
            expect(result).toBe(mockResult);
            done();
        });
    });

    it('should call real API when useMockData is false and map response correctly', function(done) {
        // Arrange
        ENV_CONFIG.useMockData = false;
        var responseDto = {
            cardId: 'CARD123',
            month: '2026-07',
            totalSpend: 100,
            currency: 'USD',
            statementType: 'statement',
            dataFreshness: 'fresh',
            kpis: [{ id: 'totalSpend', label: 'Total Spend', value: 100, formattedValue: '$100' }],
            breakdown: [{ categoryId: 'groceries', categoryName: 'Groceries', amount: 50, percentageOfTotal: 50 }]
        };
        var httpResponse = Promise.resolve({ data: responseDto });
        $httpMock.and.returnValue(httpResponse);

        // Act
        var promise = DashboardApiService.getMonthlySummary('CARD123', '2026-07');

        // Assert
        promise.then(function(result) {
            expect($httpMock).toHaveBeenCalled();
            expect(result.summary.dto.cardId).toBe('CARD123');
            expect(result.kpis[0].dto.id).toBe('totalSpend');
            expect(result.breakdown[0].dto.categoryName).toBe('Groceries');
            done();
        });
    });

    it('should reject with mapped error when real API call fails', function(done) {
        // Arrange
        ENV_CONFIG.useMockData = false;
        var errorResponse = { status: 500, data: { message: 'Server error' } };
        $httpMock.and.returnValue(Promise.reject(errorResponse));

        // Act
        var promise = DashboardApiService.getMonthlySummary('CARD123', '2026-07');

        // Assert
        promise.catch(function(errorModel) {
            expect(HttpErrorFactoryMock.fromHttpResponse).toHaveBeenCalledWith(errorResponse);
            expect(LoggingServiceMock.error).toHaveBeenCalled();
            expect(errorModel.code).toBe('ERROR');
            done();
        });
    });

    it('should throw error model when mapResponse receives invalid dto', function(done) {
        // Arrange
        ENV_CONFIG.useMockData = false;
        var invalidDto = { cardId: 'CARD123' }; // missing required fields
        $httpMock.and.returnValue(Promise.resolve({ data: invalidDto }));

        // Act
        var promise = DashboardApiService.getMonthlySummary('CARD123', '2026-07');

        // Assert
        promise.catch(function(errorModel) {
            expect(errorModel.code).toBe('ERROR');
            expect(HttpErrorFactoryMock.fromHttpResponse).toHaveBeenCalled();
            done();
        });
    });
});

/*
Test Documentation:
- Test Name: Card ID required validation
- Purpose: Ensure getMonthlySummary rejects when cardId is empty or whitespace.
- Scenario: Call with '   ' cardId and valid month.
- Expected Result: Promise rejects with error model from HttpErrorFactory.

- Test Name: Month format validation
- Purpose: Validate rejection when month does not match YYYY-MM pattern.
- Scenario: Call with valid cardId and 'invalid' month.
- Expected Result: Promise rejects with error model from HttpErrorFactory.

- Test Name: Mock data usage
- Purpose: Confirm that useMockData=true routes calls to MonthlySummaryMockService.
- Scenario: ENV_CONFIG.useMockData true; MonthlySummaryMockService returns mock result.
- Expected Result: LoggingService.info called; MonthlySummaryMockService.getMonthlySummary invoked; result is mockResult.

- Test Name: Real API call mapping
- Purpose: Verify behavior when useMockData=false and $http resolves with valid dto.
- Scenario: Real HTTP call returns full dto.
- Expected Result: Result.summary, kpis, breakdown mapped into model instances.

- Test Name: Real API failure handling
- Purpose: Ensure rejection path maps error via HttpErrorFactory and logs error.
- Scenario: $http rejects with error response.
- Expected Result: HttpErrorFactory.fromHttpResponse called; LoggingService.error called; promise rejects with error model.

- Test Name: Invalid response mapping
- Purpose: Confirm mapResponse throws error model for incomplete dto.
- Scenario: $http resolves with dto missing required fields.
- Expected Result: Promise rejects with error model.
*/

/*
Coverage Report:
- Functions tested:
  - DashboardApiService.getMonthlySummary
  - mapResponse (indirectly via getMonthlySummary)
  - getKpiIcon / getSupportingLabel / maskCardId (partially via mapping and logging)
- Statements covered:
  - Input trimming and validation
  - Mock vs real API branch
  - HTTP request construction and logging
  - Response mapping to MonthlySummaryModel, KpiSummaryModel, BreakdownItemModel
  - Error mapping via HttpErrorFactory and LoggingService.error
- Branches covered:
  - Empty cardId vs non-empty
  - Valid vs invalid month format
  - ENV_CONFIG.useMockData true vs false
  - HTTP success vs failure
  - mapResponse dto valid vs invalid
  - Kpi icon/supporting label mapping for totalSpend
- Error scenarios covered:
  - Card ID missing
  - Invalid month format
  - HTTP failure
  - Invalid API response dto
- Uncovered scenarios:
  - Additional KPI IDs and corresponding mappings
  - Behavior when $injector.get('$http') returns unexpected value
*/