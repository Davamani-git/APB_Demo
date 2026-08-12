(function(){'use strict';
  angular.module('analytics').service('budgetAlertService', budgetAlertService);
  budgetAlertService.$inject = ['$http','notificationService','$interval'];
  function budgetAlertService($http,notificationService,$interval){
    var self=this, timer=null, CHECK_MS=1800000;
    self.checkThresholds=checkThresholds;
    self.startMonitoring=startMonitoring;
    self.stopMonitoring=stopMonitoring;
    function checkThresholds(){
      return $http.get('/api/budgets/check-thresholds').then(function(res){
        var violations=res.data.violations||[];
        angular.forEach(violations,function(v){
          var alertDetails={type:'budget-threshold',companyId:v.companyId,threshold:v.threshold,current:v.current,severity:v.severity};
          notificationService.sendAlert(alertDetails);
        });
        return violations;
      });
    }
    function startMonitoring(){
      stopMonitoring();
      checkThresholds();
      timer=$interval(checkThresholds,CHECK_MS);
      return timer;
    }
    function stopMonitoring(){
      if(timer){$interval.cancel(timer);timer=null;}
    }
  }
})();
