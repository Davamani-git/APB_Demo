'use strict';

(function () {
  angular
    .module('davBanking.personalInsights')
    .constant('PERSONAL_INSIGHTS_API_BASE_URL', 'https://api.davbanking.com/personal-insights/v1')
    .constant('INSIGHT_CATEGORIES', ['SPENDING', 'SAVINGS', 'FEES', 'OTHER'])
    .constant('INSIGHT_SEVERITY_LEVELS', ['LOW', 'MEDIUM', 'HIGH']);
})();
