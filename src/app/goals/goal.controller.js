(function() {
  'use strict';
  angular.module('app.goals')
    .controller('GoalController', ['$scope', 'GoalService', function($scope, GoalService) {
      var vm = this;
      vm.goals = [];
      vm.newGoal = {};
      vm.loading = false;
      vm.error = null;
      vm.showCreateForm = false;
      vm.createGoal = createGoal;
      vm.updateGoal = updateGoal;
      vm.deleteGoal = deleteGoal;
      vm.toggleCreateForm = toggleCreateForm;
      vm.cancelCreate = cancelCreate;
      init();
      function init() {
        loadGoals();
      }
      function loadGoals() {
        vm.loading = true;
        GoalService.getGoals()
          .then(function(goals) {
            vm.goals = goals.map(function(goal) {
              goal.progress = GoalService.calculateProgress(goal);
              goal.projectedCompletionDate = GoalService.calculateProjectedCompletion(goal);
              return goal;
            });
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load goals';
            vm.loading = false;
          });
      }
      function createGoal() {
        if (!vm.newGoal.name || !vm.newGoal.targetAmount || !vm.newGoal.targetDate) {
          vm.error = 'Please fill all required fields';
          return;
        }
        var goalData = {
          name: vm.newGoal.name,
          targetAmount: vm.newGoal.targetAmount,
          targetDate: vm.newGoal.targetDate
        };
        GoalService.createGoal(goalData)
          .then(function() {
            vm.newGoal = {};
            vm.showCreateForm = false;
            loadGoals();
          })
          .catch(function(error) {
            vm.error = 'Failed to create goal';
          });
      }
      function updateGoal(goal) {
        GoalService.updateGoal(goal.id, goal)
          .then(function() {
            loadGoals();
          })
          .catch(function(error) {
            vm.error = 'Failed to update goal';
          });
      }
      function deleteGoal(goalId) {
        if (!confirm('Are you sure you want to delete this goal?')) {
          return;
        }
        GoalService.deleteGoal(goalId)
          .then(function() {
            loadGoals();
          })
          .catch(function(error) {
            vm.error = 'Failed to delete goal';
          });
      }
      function toggleCreateForm() {
        vm.showCreateForm = !vm.showCreateForm;
        if (vm.showCreateForm) {
          vm.newGoal = {};
        }
      }
      function cancelCreate() {
        vm.showCreateForm = false;
        vm.newGoal = {};
      }
    }]);
})();