'use strict';

describe('RemindersService', function () {
  beforeEach(module('rbApp.reminders'));

  var RemindersService, $httpBackend, EnvConfig;

  beforeEach(inject(function (_RemindersService_, _$httpBackend_, _EnvConfig_) {
    RemindersService = _RemindersService_;
    $httpBackend = _$httpBackend_;
    EnvConfig = _EnvConfig_;
  }));

  it('should fetch upcoming reminders', function (done) {
    $httpBackend.expectGET(EnvConfig.REMINDERS_API_BASE_URL + '/reminders/upcoming')
      .respond(200, { items: [] });

    RemindersService.getUpcomingReminders({}).then(function (list) {
      expect(Array.isArray(list)).toBe(true);
      done();
    });

    $httpBackend.flush();
  });
});
