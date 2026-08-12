(function(){'use strict';
  angular.module('analytics').service('notificationService', notificationService);
  notificationService.$inject = ['$http','$rootScope'];
  function notificationService($http,$rootScope){
    var self=this; self.sendAlert=sendAlert; self.notifyInApp=notifyInApp;
    function sendAlert(alertDetails){
      return $http.post('/api/notifications/send',alertDetails).then(function(res){
        notifyInApp(alertDetails); return res.data;
      });
    }
    function notifyInApp(alertDetails){
      $rootScope.$broadcast('inAppNotification',alertDetails);
    }
  }
})();
