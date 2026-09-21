angular.module('creditCardApp').controller('AnalyticsController',['AnalyticsService','CardService','$timeout',function(AnalyticsService,CardService,$timeout){
var vm=this;
vm.cards=[];
vm.selectedCardId=null;
vm.monthlyChart=null;
vm.categoryChart=null;
vm.loading=true;
CardService.getAllCards().then(function(cards){
vm.cards=cards;
vm.loading=false;
$timeout(function(){
vm.loadMonthlyTrends();
vm.loadCategoryWiseSpend();
},100);
});
vm.loadMonthlyTrends=function(){
AnalyticsService.getMonthlyTrends().then(function(result){
var ctx=document.getElementById('monthlyTrendChart');
if(vm.monthlyChart)vm.monthlyChart.destroy();
vm.monthlyChart=new Chart(ctx,{type:'line',data:{labels:result.labels,datasets:[{label:'Monthly Spend',data:result.data,borderColor:'#3498db',backgroundColor:'rgba(52,152,219,0.1)',tension:0.4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true}}}});
});
};
vm.loadCategoryWiseSpend=function(){
AnalyticsService.getCategoryWiseSpend(vm.selectedCardId,null,null).then(function(result){
var ctx=document.getElementById('categoryChart');
if(vm.categoryChart)vm.categoryChart.destroy();
vm.categoryChart=new Chart(ctx,{type:'bar',data:{labels:result.labels,datasets:[{label:'Spend by Category',data:result.data,backgroundColor:['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#34495e','#e67e22','#95a5a6']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});
});
};
vm.filterByCard=function(){
vm.loadCategoryWiseSpend();
};
}]);