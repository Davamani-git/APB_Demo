(function(){'use strict';
  angular.module('reporting').controller('reportController', reportController);
  reportController.$inject = ['reportGeneratorService'];
  function reportController(reportGeneratorService){
    var vm=this;
    vm.reportTypes=['portfolio-summary','cost-breakdown','trend-analysis'];
    vm.selectedType=null;
    vm.report=null;
    vm.generate=generate;
    vm.export=exportReport;
    function generate(){
      if(!vm.selectedType){return;}
      vm.loading=true;
      reportGeneratorService.generateReport(vm.selectedType,{}).then(function(report){
        vm.report=report;
        vm.loading=false;
      }).catch(function(err){
        vm.error=err.message||'Failed to generate report';
        vm.loading=false;
      });
    }
    function exportReport(format){
      if(!vm.report||!vm.report.reportId){return;}
      reportGeneratorService.exportReport(vm.report.reportId,format).then(function(blob){
        var url=window.URL.createObjectURL(blob);
        var a=document.createElement('a');
        a.href=url;
        a.download='report.'+format;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }
})();
