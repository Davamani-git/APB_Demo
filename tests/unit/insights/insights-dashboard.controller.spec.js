'use strict';

describe('InsightsDashboardController', function () {
  beforeEach(module('rbApp.insights'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  it('should initialize controller', function () {
    var vm = $controller('InsightsDashboardController', {
      $location: {},
      InsightsService: { getInsights: function () { return Promise.resolve([]); } },
      RbacService: { canViewInsights: function () { return true; } },
      LoggingService: {},
      InsightsQueryModel: function () { this.isValidRange = function () { return true; }; }
    });
    expect(vm).toBeDefined();
  });
});
