(function() {
  'use strict';
  angular.module('app.insights')
    .controller('InsightsController', ['$scope', 'InsightsService', function($scope, InsightsService) {
      var vm = this;
      vm.insights = [];
      vm.loading = false;
      vm.error = null;
      vm.loadInsights = loadInsights;
      vm.requestExplanation = requestExplanation;
      vm.submitFeedback = submitFeedback;
      init();
      function init() {
        loadInsights();
      }
      function loadInsights() {
        vm.loading = true;
        InsightsService.getInsights()
          .then(function(insights) {
            vm.insights = insights;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load insights';
            vm.loading = false;
          });
      }
      function requestExplanation(insightId) {
        InsightsService.getExplanation(insightId)
          .then(function(explanation) {
            var insight = vm.insights.find(function(i) { return i.id === insightId; });
            if (insight) {
              insight.detailedExplanation = explanation.detailedExplanation;
              insight.showExplanation = true;
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load explanation';
          });
      }
      function submitFeedback(insightId, feedback) {
        InsightsService.postFeedback(insightId, feedback)
          .then(function() {
            var insight = vm.insights.find(function(i) { return i.id === insightId; });
            if (insight) {
              insight.userFeedback = feedback;
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to submit feedback';
          });
      }
    }]);
})();