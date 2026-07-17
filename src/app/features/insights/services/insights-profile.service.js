(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .service('InsightsProfileService', InsightsProfileService);

  InsightsProfileService.$inject = ['ApiGatewayService', 'InsightsCacheService', 'ProfileModel'];

  function InsightsProfileService(ApiGatewayService, InsightsCacheService, ProfileModel) {
    const PROFILE_CACHE_KEY = 'PROFILE';

    this.getProfile = function (forceRefresh) {
      const cached = !forceRefresh && InsightsCacheService.getCachedInsights(PROFILE_CACHE_KEY);
      if (cached) {
        return Promise.resolve(cached);
      }
      return ApiGatewayService.get('INSIGHTS', '/profile')
        .then(function (data) {
          const model = new ProfileModel(data);
          InsightsCacheService.setCachedInsights(PROFILE_CACHE_KEY, model);
          return model;
        });
    };
  }
})();
