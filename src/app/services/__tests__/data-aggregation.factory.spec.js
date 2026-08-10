/*
Test Documentation:
- Test Name: dataAggregationFactory - aggregateData
- Purpose: Validates data aggregation from multiple providers
- Scenario: Aggregate raw provider data
- Expected Result: Should return normalized aggregated data

Test Documentation:
- Test Name: dataAggregationFactory - normalizeProviderData
- Purpose: Validates provider data normalization
- Scenario: Normalize different provider data formats
- Expected Result: Should return standardized format

Test Documentation:
- Test Name: dataAggregationFactory - calculateFreshness
- Purpose: Validates data freshness calculation
- Scenario: Calculate freshness based on last update
- Expected Result: Should return correct freshness status

Test Documentation:
- Test Name: dataAggregationFactory - consolidateMultipleCompanies
- Purpose: Validates multi-company consolidation
- Scenario: Consolidate data from multiple companies
- Expected Result: Should return consolidated portfolio data

Coverage Report:
- Functions tested: aggregateData, normalizeProviderData, calculateFreshness, consolidateMultipleCompanies
- Scenarios covered: aggregation, normalization, freshness calculation, consolidation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('dataAggregationFactory', function() {
    var dataAggregationFactory, cloudProviderService;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_dataAggregationFactory_, _cloudProviderService_) {
      dataAggregationFactory = _dataAggregationFactory_;
      cloudProviderService = _cloudProviderService_;
    }));

    describe('aggregateData', function() {
      it('should aggregate raw provider data', function() {
        var rawData = {
          companyId: 'comp123',
          providers: [
            {provider: 'AWS', cost: 5000, usageMetrics: {compute: 100}, lastSync: '2024-01-15'},
            {provider: 'AZURE', cost: 3000, usageMetrics: {storage: 200}, lastSync: '2024-01-15'}
          ]
        };
        var result = dataAggregationFactory.aggregateData(rawData);
        expect(result.companyId).toBe('comp123');
        expect(result.totalCost).toBe(8000);
        expect(result.providers.length).toBe(2);
        expect(result.dataFreshness).toBeDefined();
      });

      it('should handle empty providers array', function() {
        var rawData = {
          companyId: 'comp123',
          providers: []
        };
        var result = dataAggregationFactory.aggregateData(rawData);
        expect(result.totalCost).toBe(0);
        expect(result.providers.length).toBe(0);
      });

      it('should handle missing providers', function() {
        var rawData = {
          companyId: 'comp123'
        };
        var result = dataAggregationFactory.aggregateData(rawData);
        expect(result.totalCost).toBe(0);
      });
    });

    describe('normalizeProviderData', function() {
      it('should normalize provider data with cost field', function() {
        var providerData = {
          provider: 'AWS',
          cost: 5000,
          usageMetrics: {compute: 100},
          lastSync: '2024-01-15'
        };
        var result = dataAggregationFactory.normalizeProviderData(providerData);
        expect(result.provider).toBe('AWS');
        expect(result.cost).toBe(5000);
        expect(result.usage.compute).toBe(100);
      });

      it('should normalize provider data with billing field', function() {
        var providerData = {
          name: 'AZURE',
          billing: {total: 3000},
          timestamp: '2024-01-15'
        };
        var result = dataAggregationFactory.normalizeProviderData(providerData);
        expect(result.provider).toBe('AZURE');
        expect(result.cost).toBe(3000);
      });

      it('should handle missing cost data', function() {
        var providerData = {
          provider: 'GCP'
        };
        var result = dataAggregationFactory.normalizeProviderData(providerData);
        expect(result.cost).toBe(0);
      });
    });

    describe('calculateFreshness', function() {
      it('should return current for fresh data', function() {
        var providers = [
          {lastUpdated: new Date()}
        ];
        var freshness = dataAggregationFactory.calculateFreshness(providers);
        expect(freshness).toBe('current');
      });

      it('should return stale for old data', function() {
        var oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 2);
        var providers = [
          {lastUpdated: oldDate}
        ];
        var freshness = dataAggregationFactory.calculateFreshness(providers);
        expect(freshness).toBe('stale');
      });

      it('should return missing for empty providers', function() {
        var freshness = dataAggregationFactory.calculateFreshness([]);
        expect(freshness).toBe('missing');
      });

      it('should return missing for null providers', function() {
        var freshness = dataAggregationFactory.calculateFreshness(null);
        expect(freshness).toBe('missing');
      });
    });

    describe('consolidateMultipleCompanies', function() {
      it('should consolidate data from multiple companies', function() {
        var companiesData = [
          {
            companyId: 'comp1',
            providers: [
              {provider: 'AWS', cost: 5000, lastSync: '2024-01-15'}
            ]
          },
          {
            companyId: 'comp2',
            providers: [
              {provider: 'AZURE', cost: 3000, lastSync: '2024-01-15'},
              {provider: 'GCP', cost: 2000, lastSync: '2024-01-15'}
            ]
          }
        ];
        var result = dataAggregationFactory.consolidateMultipleCompanies(companiesData);
        expect(result.totalCost).toBe(10000);
        expect(result.companies.length).toBe(2);
        expect(result.providerBreakdown.AWS).toBe(5000);
        expect(result.providerBreakdown.AZURE).toBe(3000);
        expect(result.providerBreakdown.GCP).toBe(2000);
      });

      it('should handle empty companies array', function() {
        var result = dataAggregationFactory.consolidateMultipleCompanies([]);
        expect(result.totalCost).toBe(0);
        expect(result.companies.length).toBe(0);
      });
    });
  });
})();