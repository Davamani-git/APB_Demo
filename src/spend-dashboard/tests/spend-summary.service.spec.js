/* global describe, beforeEach, inject, it, expect, module */

describe('SpendSummaryService', function () {
  'use strict';

  var SpendSummaryService;

  beforeEach(module('apb.core'));
  beforeEach(module('apb.shared'));
  beforeEach(module('apb.spendDashboard'));

  beforeEach(inject(function (_SpendSummaryService_) {
    SpendSummaryService = _SpendSummaryService_;
  }));

  it('rejects invalid month format', function (done) {
    SpendSummaryService.getMonthlySummary('2024-13').catch(function (err) {
      expect(err.code).toBe('INVALID_MONTH');
      done();
    });
  });
});
