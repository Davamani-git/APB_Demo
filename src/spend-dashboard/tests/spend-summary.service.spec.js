'use strict';

describe('SpendSummaryService', function () {
  beforeEach(module('apb.spendDashboard'));

  var SpendSummaryService;

  beforeEach(inject(function (_SpendSummaryService_) {
    SpendSummaryService = _SpendSummaryService_;
  }));

  it('should reject invalid month format', function (done) {
    SpendSummaryService.getMonthlySummary('2026-13')
      .catch(function (error) {
        expect(error.code).toBe('INVALID_MONTH');
        done();
      });
  });
});
