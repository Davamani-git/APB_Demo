(function(){
'use strict';
angular.module('helpCenterApp').factory('AnalyticsService',[AnalyticsService]);
function AnalyticsService(){
var service={trackPageView:trackPageView,trackEvent:trackEvent};
return service;
function trackPageView(page){
console.log('Page view:',page);
}
function trackEvent(eventName,data){
console.log('Event:',eventName,data||{});
}
}
})();