(function(){
'use strict';
angular.module('creditCardApp').directive('spendTrendChart',['$timeout',function($timeout){
return{restrict:'A',scope:{data:'='},link:function(scope,element,attrs){
var chart=null;
function renderChart(){
if(chart){chart.destroy();}
var labels=scope.data.map(function(d){return d.month;});
var values=scope.data.map(function(d){return d.amount;});
var ctx=element[0].getContext('2d');
chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:values,borderColor:'#4CAF50',backgroundColor:'rgba(76,175,80,0.2)',tension:0.3}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:true}}}});
}
scope.$watch('data',function(newVal){
if(newVal&&newVal.length>0){
$timeout(renderChart,100);
}},true);
scope.$on('$destroy',function(){
if(chart){chart.destroy();}
});
}};
}]).directive('categoryChart',['$timeout',function($timeout){
return{restrict:'A',scope:{data:'='},link:function(scope,element,attrs){
var chart=null;
function renderChart(){
if(chart){chart.destroy();}
var labels=scope.data.map(function(d){return d.category;});
var values=scope.data.map(function(d){return d.amount;});
var ctx=element[0].getContext('2d');
chart=new Chart(ctx,{type:'bar',data:{labels:labels,datasets:[{label:'Spend by Category',data:values,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}}}});
}
scope.$watch('data',function(newVal){
if(newVal&&newVal.length>0){
$timeout(renderChart,100);
}},true);
scope.$on('$destroy',function(){
if(chart){chart.destroy();}
});
}};
}]).directive('cardWiseChart',['$timeout',function($timeout){
return{restrict:'A',scope:{data:'=',cards:'='},link:function(scope,element,attrs){
var chart=null;
function renderChart(){
if(chart){chart.destroy();}
var cardNames=scope.data.map(function(d){
var card=scope.cards.find(function(c){return c.id===d.cardId;});
return card?card.name:d.cardId;
});
var values=scope.data.map(function(d){return d.amount;});
var ctx=element[0].getContext('2d');
chart=new Chart(ctx,{type:'pie',data:{labels:cardNames,datasets:[{data:values,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF']}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:true,position:'bottom'}}}});
}
scope.$watch('data',function(newVal){
if(newVal&&newVal.length>0&&scope.cards&&scope.cards.length>0){
$timeout(renderChart,100);
}},true);
scope.$on('$destroy',function(){
if(chart){chart.destroy();}
});
}};
}]);
})();