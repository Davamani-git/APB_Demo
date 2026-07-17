'use strict';

describe('MonthlyDashboardController', function () {
  beforeEach(module('apb.spendDashboard'));

  var $controller, $rootScope;

  beforeEach(inject(function (_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  it('should be defined', function () {
    var scope = $rootScope.$new();
    var ctrl = $controller('MonthlyDashboardController as vm', { $scope: scope });
    expect(ctrl).toBeDefined();
  });
});
