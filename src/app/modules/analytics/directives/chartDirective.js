(function(){'use strict';
  angular.module('analytics').directive('apbChart', apbChartDirective);
  apbChartDirective.$inject = ['$timeout'];
  function apbChartDirective($timeout){
    return {
      restrict:'E',
      scope:{data:'=',type:'@'},
      template:'<canvas></canvas>',
      link:function(scope,element){
        var canvas=element.find('canvas')[0];
        var ctx=canvas.getContext('2d');
        scope.$watch('data',function(newData){
          if(!newData){return;}
          $timeout(function(){
            new Chart(ctx,{type:scope.type||'bar',data:newData,options:{responsive:true}});
          },100);
        });
      }
    };
  }
})();
