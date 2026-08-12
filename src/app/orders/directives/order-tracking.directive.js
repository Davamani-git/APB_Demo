(function(){
'use strict';
angular.module('ecommerce.orders').directive('orderTracking',function(){
return{
restrict:'E',scope:{order:'=',trackingInfo:'='},template:'<div class="order-tracking">'+
'<div ng-if="!trackingInfo" class="alert alert-info">Loading tracking information...</div>'+
'<div ng-if="trackingInfo">'+
'<p><strong>Tracking Number:</strong> {{trackingInfo.trackingNumber}}</p>'+
'<p><strong>Current Status:</strong> {{trackingInfo.status}}</p>'+
'<p><strong>Last Update:</strong> {{trackingInfo.lastUpdate | date:"short"}}</p>'+
'<div class="timeline">'+
'<div ng-repeat="event in trackingInfo.events track by $index" class="timeline-item">'+
'<div class="timeline-marker"></div>'+
'<div class="timeline-content">'+
'<p><strong>{{event.status}}</strong></p>'+
'<p>{{event.description}}</p>'+
'<p class="text-muted">{{event.timestamp | date:"short"}}</p>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>',link:function(scope,element,attrs){
}
};
});
})();