(function() {
  'use strict';
  angular.module('app.accounts')
    .directive('accountList', ['AccountService', function(AccountService) {
      return {
        restrict: 'E',
        scope: {
          accounts: '=',
          onDisconnect: '&',
          onSync: '&'
        },
        template: '<div class="account-list">' +
          '<div ng-repeat="account in accounts track by account.id" class="panel panel-default">' +
          '<div class="panel-body">' +
          '<h4>{{account.institutionName}} - {{account.accountType}}</h4>' +
          '<p>Balance: ${{account.balance | number:2}}</p>' +
          '<p>Status: <span ng-class="getStatusClass(account.syncStatus)">{{account.syncStatus}}</span></p>' +
          '<p>Last Sync: {{account.lastSyncDate | date:"short"}}</p>' +
          '<button class="btn btn-primary btn-sm" ng-click="onSync({accountId: account.id})">Sync Now</button> ' +
          '<button class="btn btn-danger btn-sm" ng-click="onDisconnect({accountId: account.id})">Disconnect</button>' +
          '</div></div></div>',
        link: function(scope) {
          scope.getStatusClass = function(status) {
            return 'account-status-' + status;
          };
        }
      };
    }]);
})();