'use strict';

describe('InsightsService', function () {
  beforeEach(module('rbApp.insights'));

  var InsightsService, $httpBackend, EnvConfig;

  beforeEach(inject(function (_InsightsService_, _$httpBackend_, _EnvConfig_) {
    InsightsService = _InsightsService_;
    $httpBackend = _$httpBackend_;
    EnvConfig = _EnvConfig_;
  }));

  it('should fetch insights list', function (done) {
    var fromDate = new Date();
    var toDate = new Date();
    var query = { fromDate: fromDate, toDate: toDate, page: 1, pageSize: 20 };

    $httpBackend.expectGET(EnvConfig.INSIGHTS_API_BASE_URL + '/insights?fromDate=' + fromDate.toISOString().substr(0, 10) + '&toDate=' + toDate.toISOString().substr(0, 10) + '&page=1&pageSize=20')
      .respond(200, { items: [] });

    InsightsService.getInsights(query).then(function (list) {
      expect(Array.isArray(list)).toBe(true);
      done();
    });

    $httpBackend.flush();
  });
});
