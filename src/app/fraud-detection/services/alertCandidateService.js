angular.module('fraudDetectionModule').service('alertCandidateService', ['$http', '$q', 'AlertModel', function($http, $q, AlertModel) {
  const API_BASE = '/api/alerts';
  this.createAlert = function(alertData) {
    try {
      const alert = new AlertModel(alertData);
      return $http.post(API_BASE, alert).then(function(response) {
        return new AlertModel(response.data);
      }).catch(function(error) {
        console.error('Failed to create alert:', error);
        return $q.reject(error);
      });
    } catch (e) {
      return $q.reject({ error: e.message });
    }
  };
  this.getAlerts = function(filters) {
    return $http.get(API_BASE, { params: filters }).then(function(response) {
      return response.data.map(function(data) {
        return new AlertModel(data);
      });
    }).catch(function(error) {
      console.error('Failed to fetch alerts:', error);
      return $q.reject(error);
    });
  };
  this.updateAlert = function(alertId, updates) {
    return $http.put(API_BASE + '/' + alertId, updates).then(function(response) {
      return new AlertModel(response.data);
    }).catch(function(error) {
      console.error('Failed to update alert:', error);
      return $q.reject(error);
    });
  };
  this.deleteAlert = function(alertId) {
    return $http.delete(API_BASE + '/' + alertId).catch(function(error) {
      console.error('Failed to delete alert:', error);
      return $q.reject(error);
    });
  };
}]);