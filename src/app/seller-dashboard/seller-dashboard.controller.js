(function(){
'use strict';
angular.module('ecommerce.sellerDashboard').controller('SellerDashboardController',['$scope','OrderManagementService','AnalyticsService','SessionService','$interval',function($scope,OrderManagementService,AnalyticsService,SessionService,$interval){
var vm=this;
vm.orders=[];
vm.salesData=null;
vm.loading=false;
vm.error=null;
vm.selectedPeriod='monthly';
var pollInterval=null;
vm.init=function(){
var sellerId=SessionService.getUserId();
if(sellerId){
vm.loadOrders(sellerId);
vm.loadSalesAnalytics(sellerId);
vm.startPolling(sellerId);
}
};
vm.loadOrders=function(sellerId){
vm.loading=true;
vm.error=null;
OrderManagementService.getOrdersBySeller(sellerId).then(function(data){
vm.orders=data;
vm.loading=false;
},function(error){
vm.error='Failed to load orders. Please try again.';
vm.loading=false;
});
};
vm.loadSalesAnalytics=function(sellerId){
AnalyticsService.getSalesReport(sellerId,vm.selectedPeriod).then(function(data){
vm.salesData=data;
},function(error){
vm.error='Failed to load sales analytics.';
});
};
vm.updateOrderStatus=function(orderId,status){
OrderManagementService.updateOrderStatus(orderId,status).then(function(data){
alert('Order status updated successfully');
var sellerId=SessionService.getUserId();
vm.loadOrders(sellerId);
},function(error){
vm.error='Failed to update order status.';
});
};
vm.changePeriod=function(period){
vm.selectedPeriod=period;
var sellerId=SessionService.getUserId();
AnalyticsService.clearCache();
vm.loadSalesAnalytics(sellerId);
};
vm.startPolling=function(sellerId){
pollInterval=$interval(function(){
OrderManagementService.getOrdersBySeller(sellerId).then(function(data){
vm.orders=data;
},function(error){
console.error('Polling error:',error);
});
},30000);
};
$scope.$on('$destroy',function(){
if(pollInterval){
$interval.cancel(pollInterval);
}
});
vm.init();
}]);
})();