(function(){'use strict';
  angular.module('dataInfrastructure').service('dataTransformService', dataTransformService);
  dataTransformService.$inject = [];
  function dataTransformService(){
    var self=this; self.normalize=normalize;
    var rates={USD:1,EUR:1.08,GBP:1.27,INR:0.012};
    function toUsd(amount,currency){var r=rates[currency]||1;return Math.round(amount*r*100)/100;}
    function normalize(rawData){
      return {
        companyId:rawData.companyId,
        provider:rawData.provider,
        serviceName:rawData.serviceType,
        usageQuantity:_.get(rawData,'usageMetrics.quantity',0),
        cost:toUsd(rawData.spendAmount||0,rawData.currency||'USD'),
        normalizedCurrency:'USD',
        date:rawData.timestamp?moment(rawData.timestamp).toDate():new Date(),
        category:_.get(rawData,'usageMetrics.category','general')
      };
    }
  }
})();
