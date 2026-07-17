(function () {
  'use strict';

  angular
    .module('rbApp')
    .constant('EnvConfig', {
      INSIGHTS_API_BASE_URL: 'https://api-dev.bank.com/insights',
      REMINDERS_API_BASE_URL: 'https://api-dev.bank.com/reminders',
      LOGGING_API_BASE_URL: 'https://logs-dev.bank.com',
      FEATURE_FLAGS: {
        INSIGHTS_ENABLED: true,
        FEEDBACK_ENABLED: true,
        REMINDERS_ENABLED: true,
        REMINDERS_SMS_ENABLED: false
      },
      maxDateRangeDays: 365
    });
})();
