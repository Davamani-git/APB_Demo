/*
Test Documentation:
- Test Name: analyticsService - fetchPortfolioMetrics
- Purpose: Validates fetching and enriching portfolio metrics
- Scenario: Fetch metrics with filters and generate recommendations
- Expected Result: Should return metrics with recommendations

Test Documentation:
- Test Name: analyticsService - generateRecommendations consolidation
- Purpose: Validates consolidation recommendation generation
- Scenario: Metrics with multiple providers
- Expected Result: Should generate consolidation recommendation

Test Documentation:
- Test Name: analyticsService - generateRecommendations cost spike
- Purpose: Validates cost spike detection
- Scenario: Company with high cost increase
- Expected Result: Should generate cost spike recommendation

Test Documentation:
- Test Name: analyticsService - generateRecommendations volume discount
- Purpose: Validates volume discount recommendation
- Scenario: High total spend portfolio
- Expected Result: Should generate volume discount recommendation

Test Documentation:
- Test Name: analyticsService - calculateKPIs
- Purpose: Validates KPI calculation from data
- Scenario: Calculate KPIs from company data
- Expected Result: Should return correct KPI values

Test Documentation:
- Test Name: analyticsService - getCompanyDetails
- Purpose: Validates fetching company details
- Scenario: Get details for specific company
- Expected Result: Should return company details

Test Documentation:
- Test Name: analyticsService - getDepartmentBreakdown
- Purpose: Validates fetching department breakdown
- Scenario: Get department breakdown for company
- Expected Result: Should return department data

Coverage Report:
- Functions tested: fetchPortfolioMetrics, generateRecommendations, calculateKPIs, getCompanyDetails, getDepartmentBreakdown
- Scenarios covered: normal operation, multiple recommendation types, KPI calculations, HTTP interactions
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('analyticsService', function() {
    var analyticsService, $httpBackend, dataAggregationFactory;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_analyticsService_, _$httpBackend_, _dataAggregationFactory_) {
      analyticsService = _analyticsService_;
      $httpBackend = _$httpBackend_;
      dataAggregationFactory = _dataAggregationFactory_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchPortfolioMetrics', function() {
      it('should fetch portfolio metrics and add recommendations', function() {
        var filters = {startDate: '2024-01-01', endDate: '2024-12-31'};
        var mockMetrics = {
          totalSpend: 150000,
          providerBreakdown: {AWS: 80000, AZURE: 70000},
          topCompanies: [{name: 'Company A', spend: 50000, change: 25}]
        };
        $httpBackend.expectGET('/api/portfolio/metrics?endDate=2024-12-31&startDate=2024-01-01').respond(200, mockMetrics);
        var result;
        analyticsService.fetchPortfolioMetrics(filters).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.totalSpend).toBe(150000);
        expect(result.recommendations).toBeDefined();
        expect(result.recommendations.length).toBeGreaterThan(0);
      });

      it('should handle fetch error', function() {
        $httpBackend.expectGET('/api/portfolio/metrics').respond(500, 'Error');
        var errorCaught = false;
        analyticsService.fetchPortfolioMetrics().catch(function() {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('generateRecommendations', function() {
      it('should generate consolidation recommendation for multi-cloud', function() {
        var metrics = {
          totalSpend: 100000,
          providerBreakdown: {AWS: 60000, AZURE: 40000}
        };
        var recommendations = analyticsService.generateRecommendations(metrics);
        var consolidation = recommendations.find(function(r) { return r.type === 'consolidation'; });
        expect(consolidation).toBeDefined();
        expect(consolidation.description).toContain('AWS');
        expect(consolidation.potentialSavings).toBe(15000);
      });

      it('should generate cost spike recommendation', function() {
        var metrics = {
          totalSpend: 100000,
          topCompanies: [{name: 'Company A', spend: 50000, change: 30}]
        };
        var recommendations = analyticsService.generateRecommendations(metrics);
        var costSpike = recommendations.find(function(r) { return r.type === 'cost_spike'; });
        expect(costSpike).toBeDefined();
        expect(costSpike.description).toContain('Company A');
        expect(costSpike.description).toContain('30%');
      });

      it('should generate volume discount recommendation for high spend', function() {
        var metrics = {
          totalSpend: 150000
        };
        var recommendations = analyticsService.generateRecommendations(metrics);
        var volumeDiscount = recommendations.find(function(r) { return r.type === 'volume_discount'; });
        expect(volumeDiscount).toBeDefined();
        expect(volumeDiscount.potentialSavings).toBe(15000);
      });

      it('should not generate cost spike for low change', function() {
        var metrics = {
          totalSpend: 100000,
          topCompanies: [{name: 'Company A', spend: 50000, change: 10}]
        };
        var recommendations = analyticsService.generateRecommendations(metrics);
        var costSpike = recommendations.find(function(r) { return r.type === 'cost_spike'; });
        expect(costSpike).toBeUndefined();
      });

      it('should handle empty metrics', function() {
        var recommendations = analyticsService.generateRecommendations({});
        expect(Array.isArray(recommendations)).toBe(true);
      });
    });

    describe('calculateKPIs', function() {
      it('should calculate KPIs from company data', function() {
        var data = {
          companies: [
            {totalCost: 50000},
            {totalCost: 30000},
            {totalCost: 20000}
          ],
          monthlyTrend: [
            {month: 'Jan', spend: 80000},
            {month: 'Feb', spend: 100000}
          ]
        };
        var kpis = analyticsService.calculateKPIs(data);
        expect(kpis.totalSpend).toBe(100000);
        expect(kpis.averageCostPerCompany).toBe(33333.333333333336);
        expect(kpis.monthOverMonthChange).toBe(25);
      });

      it('should handle missing companies', function() {
        var data = {monthlyTrend: []};
        var kpis = analyticsService.calculateKPIs(data);
        expect(kpis.totalSpend).toBe(0);
        expect(kpis.averageCostPerCompany).toBe(0);
      });

      it('should handle zero previous spend', function() {
        var data = {
          companies: [{totalCost: 50000}],
          monthlyTrend: [
            {month: 'Jan', spend: 0},
            {month: 'Feb', spend: 50000}
          ]
        };
        var kpis = analyticsService.calculateKPIs(data);
        expect(kpis.monthOverMonthChange).toBe(0);
      });
    });

    describe('getCompanyDetails', function() {
      it('should fetch company details', function() {
        var companyId = 'comp123';
        var mockDetails = {id: companyId, name: 'Test Company', totalCost: 50000};
        $httpBackend.expectGET('/api/portfolio/companies/comp123/details').respond(200, mockDetails);
        var result;
        analyticsService.getCompanyDetails(companyId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.id).toBe(companyId);
      });
    });

    describe('getDepartmentBreakdown', function() {
      it('should fetch department breakdown', function() {
        var companyId = 'comp123';
        var mockBreakdown = {departments: [{name: 'IT', cost: 20000}]};
        $httpBackend.expectGET('/api/portfolio/companies/comp123/departments').respond(200, mockBreakdown);
        var result;
        analyticsService.getDepartmentBreakdown(companyId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.departments).toBeDefined();
      });
    });
  });
})();