(function(){
'use strict';
angular.module('ecommerce.orders').controller('BuyerOrderController',['$scope','OrderManagementService','SessionService','$interval',function($scope,OrderManagementService,SessionService,$interval){
var vm=this;
vm.orders=[];
vm.loading=false;
vm.error=null;
vm.selectedOrder=null;
vm.trackingInfo=null;
var pollInterval=null;
vm.init=function(){
var userId=SessionService.getUserId();
if(userId){
vm.loadOrders(userId);
vm.startPolling(userId);
}
};
vm.loadOrders=function(userId){
vm.loading=true;
vm.error=null;
OrderManagementService.getOrdersByBuyer(userId).then(function(data){
vm.orders=data;
vm.loading=false;
},function(error){
vm.error='Failed to load orders. Please try again.';
vm.loading=false;
});
};
vm.cancelOrder=function(orderId){
if(!confirm('Are you sure you want to cancel this order?')){
return;
}
var userId=SessionService.getUserId();
OrderManagementService.cancelOrder(orderId,userId).then(function(data){
alert('Order cancelled successfully');
vm.loadOrders(userId);
},function(error){
vm.error='Failed to cancel order. Please try again.';
});
};
vm.viewTracking=function(order){
vm.selectedOrder=order;
vm.trackingInfo=null;
OrderManagementService.getOrderTracking(order.orderId).then(function(data){
vm.trackingInfo=data;
},function(error){
vm.error='Failed to load tracking information.';
});
};
vm.startPolling=function(userId){
pollInterval=$interval(function(){
OrderManagementService.getOrdersByBuyer(userId).then(function(data){
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