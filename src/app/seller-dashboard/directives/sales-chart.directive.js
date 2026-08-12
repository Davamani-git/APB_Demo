(function(){
'use strict';
angular.module('ecommerce.sellerDashboard').directive('salesChart',function(){
return{
restrict:'E',scope:{salesData:'='},template:'<div class="sales-chart">'+
'<canvas id="salesChartCanvas" width="400" height="200"></canvas>'+
'</div>',link:function(scope,element,attrs){
scope.$watch('salesData',function(newVal){
if(newVal&&newVal.data&&newVal.data.length>0){
var canvas=element.find('canvas')[0];
var ctx=canvas.getContext('2d');
ctx.clearRect(0,0,canvas.width,canvas.height);
var data=newVal.data;
var maxSales=Math.max.apply(null,data.map(function(d){return d.sales;}));
var barWidth=canvas.width/data.length-10;
var scale=canvas.height/maxSales*0.8;
data.forEach(function(item,index){
var barHeight=item.sales*scale;
var x=index*(barWidth+10)+5;
var y=canvas.height-barHeight-20;
ctx.fillStyle='#337ab7';
ctx.fillRect(x,y,barWidth,barHeight);
ctx.fillStyle='#000';
ctx.font='10px Arial';
ctx.fillText(item.date,x,canvas.height-5);
ctx.fillText('$'+item.sales,x,y-5);
});
}
});
}
};
});
})();