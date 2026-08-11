(function() {
  'use strict';
  angular.module('app.goals')
    .service('GoalService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      this.getGoals = function() {
        return $http.get(API_CONFIG.baseUrl + '/goals')
          .then(function(response) {
            return response.data;
          });
      };
      this.getGoal = function(goalId) {
        return $http.get(API_CONFIG.baseUrl + '/goals/' + goalId)
          .then(function(response) {
            return response.data;
          });
      };
      this.createGoal = function(goalData) {
        return $http.post(API_CONFIG.baseUrl + '/goals', goalData)
          .then(function(response) {
            return response.data;
          });
      };
      this.updateGoal = function(goalId, goalData) {
        return $http.put(API_CONFIG.baseUrl + '/goals/' + goalId, goalData)
          .then(function(response) {
            return response.data;
          });
      };
      this.deleteGoal = function(goalId) {
        return $http.delete(API_CONFIG.baseUrl + '/goals/' + goalId)
          .then(function(response) {
            return response.data;
          });
      };
      this.calculateProjectedCompletion = function(goal) {
        if (!goal.contributionHistory || goal.contributionHistory.length < 2) {
          return null;
        }
        var contributions = goal.contributionHistory;
        var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        var n = contributions.length;
        for (var i = 0; i < n; i++) {
          var x = i;
          var y = contributions[i].amount;
          sumX += x;
          sumY += y;
          sumXY += x * y;
          sumXX += x * x;
        }
        var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        if (slope <= 0) return null;
        var remaining = goal.targetAmount - goal.currentAmount;
        var monthsToComplete = Math.ceil(remaining / slope);
        var projectedDate = new Date();
        projectedDate.setMonth(projectedDate.getMonth() + monthsToComplete);
        return projectedDate;
      };
      this.calculateProgress = function(goal) {
        if (!goal.targetAmount || goal.targetAmount === 0) return 0;
        return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
      };
    }]);
})();