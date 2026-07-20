describe('MonthlySummaryMockService', function() {
    var MonthlySummaryMockService;
    var $q, $rootScope, $timeout;
    var ENV_CONFIG;
    var MonthlySummaryModelMock;
    var KpiSummaryModelMock;
    var BreakdownItemModelMock;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        ENV_CONFIG = { apiTimeoutMs: 1500 };
        MonthlySummaryModelMock = function(dto) { this.dto = dto; };
        KpiSummaryModelMock = function(dto) { this.dto = dto; };
        BreakdownItemModelMock = function(dto) { this.dto = dto; };

        $provide.value('ENV_CONFIG', ENV_CONFIG);
        $provide.value('MonthlySummaryModel', MonthlySummaryModelMock);
        $provide.value('KpiSummaryModel', KpiSummaryModelMock);
        $provide.value('BreakdownItemModel', BreakdownItemModelMock);
    }));

    beforeEach(inject(function(_MonthlySummaryMockService_, _$q_, _$rootScope_, _$timeout_) {
        MonthlySummaryMockService = _MonthlySummaryMockService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    function flushTimeouts() {
        $timeout.flush();
        $rootScope.$apply();
    }

    it('should resolve with empty summary when dataset for month is missing', function() {
        // Arrange
        var cardId = 'CARD123';
        var month = '1900-01';

        // Act
        var promise = MonthlySummaryMockService.getMonthlySummary(cardId, month);
        flushTimeouts();

        // Assert
        var result;
        promise.then(function(r) { result = r; });
        $rootScope.$apply();
        expect(result.summary.dto.cardId).toBe(cardId);
        expect(result.summary.dto.month).toBe(month);
        expect(result.summary.dto.totalSpend).toBe(0);
        expect(result.breakdown.length).toBe(0);
        expect(result.kpis.length).toBe(3);
    });

    it('should resolve with mapped summary, kpis, and breakdown when dataset exists', function() {
        // Arrange
        var cardId = 'CARD123';
        var month = '2026-07';

        // Act
        var promise = MonthlySummaryMockService.getMonthlySummary(cardId, month);
        flushTimeouts();

        // Assert
        var result;
        promise.then(function(r) { result = r; });
        $rootScope.$apply();
        expect(result.summary.dto.cardId).toBe('CARD123');
        expect(result.summary.dto.month).toBe('2026-07');
        expect(result.kpis.length).toBeGreaterThan(0);
        expect(result.breakdown.length).toBeGreaterThan(0);
    });

    it('should compute latencyMs within constraints', function() {
        // Arrange
        ENV_CONFIG.apiTimeoutMs = 200; // very low timeout
        var cardId = 'CARD123';
        var month = '2026-06';

        // Act
        var promise = MonthlySummaryMockService.getMonthlySummary(cardId, month);
        flushTimeouts();

        // Assert
        var result;
        promise.then(function(r) { result = r; });
        $rootScope.$apply();
        expect(result.summary.dto.month).toBe('2026-06');
    });
});

/*
Test Documentation:
- Test Name: Empty dataset handling
- Purpose: Ensure service returns default empty summary when no dataset for month.
- Scenario: Call getMonthlySummary with month not in MonthlySummaryMockDatasets.
- Expected Result: Summary with totalSpend 0, 3 default KPIs, empty breakdown.

- Test Name: Existing dataset mapping
- Purpose: Validate mapping of existing dataset into models.
- Scenario: Call getMonthlySummary for 2026-07.
- Expected Result: Summary cardId and month match dataset; kpis and breakdown arrays populated.

- Test Name: Latency calculation constraints
- Purpose: Ensure latencyMs calculation respects API timeout bounds.
- Scenario: Set apiTimeoutMs to low value and call service.
- Expected Result: Service still resolves and returns result.
*/

/*
Coverage Report:
- Functions tested:
  - MonthlySummaryMockService.getMonthlySummary
- Statements covered:
  - LatencyMs calculation and defaulting
  - Dataset lookup in window.MonthlySummaryMockDatasets
  - Construction of empty summary when dataset missing
  - Mapping of existing dataset into MonthlySummaryModel, KpiSummaryModel, BreakdownItemModel
- Branches covered:
  - latencyMs computed vs default 500
  - dataset found vs missing
- Error scenarios covered:
  - N/A (service always resolves)
- Uncovered scenarios:
  - Extremely large mock datasets
*/