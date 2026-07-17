/* global describe, beforeEach, inject, it, expect, module */

describe('MonthlyDashboardController', function () {
  'use strict';

  var $controller, $rootScope, $q, SpendSummaryService, ProfileService, ConfigService;

  beforeEach(module('apb.core'));
  beforeEach(module('apb.shared'));
  beforeEach(module('apb.spendDashboard'));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _SpendSummaryService_, _ProfileService_, _ConfigService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    SpendSummaryService = _SpendSummaryService_;
    ProfileService = _ProfileService_;
    ConfigService = _ConfigService_;
  }));

  it('initializes and loads default month', function () {
    spyOn(ProfileService, 'getPreferredDefaultMonth').and.callFake(function () {
      var deferred = $q.defer();
      deferred.resolve('2024-01');
      return deferred.promise;
    });

    spyOn(ConfigService, 'load').and.callFake(function () {
      var deferred = $q.defer();
      deferred.resolve();
      return deferred.promise;
    });

    spyOn(SpendSummaryService, 'getMonthlySummary').and.callFake(function () {
      var deferred = $q.defer();
      deferred.resolve({ transactionCount: 0, totalSpend: 0, breakdown: [], isStale: function () { return false; } });
      return deferred.promise;
    });

    var scope = $rootScope.$new();
    var ctrl = $controller('MonthlyDashboardController as vm', { $scope: scope });

    $rootScope.$apply();

    expect(ctrl.selectedMonth).toBe('2024-01');
    expect(SpendSummaryService.getMonthlySummary).toHaveBeenCalled();
  });
});
