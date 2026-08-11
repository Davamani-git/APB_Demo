(function() {
  'use strict';
  angular.module('app.transactions')
    .directive('transactionFilter', [function() {
      return {
        restrict: 'E',
        scope: {
          filters: '=',
          categories: '=',
          onApply: '&',
          onClear: '&'
        },
        template: '<div class="panel panel-default">' +
          '<div class="panel-body">' +
          '<div class="row">' +
          '<div class="col-md-3">' +
          '<label>Start Date:</label>' +
          '<input type="date" class="form-control" ng-model="filters.startDate">' +
          '</div>' +
          '<div class="col-md-3">' +
          '<label>End Date:</label>' +
          '<input type="date" class="form-control" ng-model="filters.endDate">' +
          '</div>' +
          '<div class="col-md-3">' +
          '<label>Category:</label>' +
          '<select class="form-control" ng-model="filters.category">' +
          '<option value="">All Categories</option>' +
          '<option ng-repeat="cat in categories track by cat.id" value="{{cat.id}}">{{cat.name}}</option>' +
          '</select>' +
          '</div>' +
          '<div class="col-md-3">' +
          '<label>Search:</label>' +
          '<input type="text" class="form-control" ng-model="filters.search" placeholder="Merchant or description">' +
          '</div>' +
          '</div>' +
          '<div class="row" style="margin-top: 10px;">' +
          '<div class="col-md-3">' +
          '<label>Min Amount:</label>' +
          '<input type="number" class="form-control" ng-model="filters.minAmount">' +
          '</div>' +
          '<div class="col-md-3">' +
          '<label>Max Amount:</label>' +
          '<input type="number" class="form-control" ng-model="filters.maxAmount">' +
          '</div>' +
          '<div class="col-md-6" style="padding-top: 25px;">' +
          '<button class="btn btn-primary" ng-click="onApply()">Apply Filters</button> ' +
          '<button class="btn btn-default" ng-click="onClear()">Clear</button>' +
          '</div>' +
          '</div>' +
          '</div></div>'
      };
    }]);
})();