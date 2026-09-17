angular.module('fraudDetectionModule').service('configService', ['$http', '$q', '$cacheFactory', 'PolicyModel', function($http, $q, $cacheFactory, PolicyModel) {
  const API_BASE = '/api/config';
  const cache = $cacheFactory('configCache');
  const CACHE_KEY = 'policyConfig';
  this.getPolicyConfiguration = function(forceRefresh) {
    if (!forceRefresh) {
      const cached = cache.get(CACHE_KEY);
      if (cached) {
        return $q.resolve(cached);
      }
    }
    return $http.get(API_BASE + '/policy').then(function(response) {
      const policy = new PolicyModel(response.data);
      cache.put(CACHE_KEY, policy);
      return policy;
    }).catch(function(error) {
      console.error('Failed to fetch policy configuration:', error);
      return $q.reject(error);
    });
  };
  this.updatePolicyConfiguration = function(policyData) {
    return $http.put(API_BASE + '/policy', policyData).then(function(response) {
      cache.remove(CACHE_KEY);
      const policy = new PolicyModel(response.data);
      cache.put(CACHE_KEY, policy);
      return policy;
    }).catch(function(error) {
      console.error('Failed to update policy configuration:', error);
      return $q.reject(error);
    });
  };
  this.getFailSafeBehavior = function() {
    return this.getPolicyConfiguration().then(function(policy) {
      return policy.failSafeBehavior;
    }).catch(function() {
      return 'fail-safe';
    });
  };
  this.clearCache = function() {
    cache.removeAll();
  };
}]);