'use strict';

describe('RemindersDashboardController', function () {
  beforeEach(module('rbApp.reminders'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  it('should initialize controller', function () {
    var vm = $controller('RemindersDashboardController', {
      $location: {},
      RemindersService: {
        getUpcomingReminders: function () { return Promise.resolve([]); },
        getPastReminders: function () { return Promise.resolve([]); }
      },
      RbacService: { isActionAllowed: function () { return true; } },
      LoggingService: {}
    });
    expect(vm).toBeDefined();
  });
});
