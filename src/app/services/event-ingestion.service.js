(function(){
'use strict';
angular.module('FraudAlertModule').factory('EventIngestionService',['AuthorizationEventService','CacheService','$q',EventIngestionService]);
function EventIngestionService(AuthorizationEventService,CacheService,$q){
var service={ingestEvents:ingestEvents,validateEvent:validateEvent,normalizeEvent:normalizeEvent,deduplicateEvents:deduplicateEvents};
return service;
function ingestEvents(filters){
return AuthorizationEventService.getTransactionEvents(filters).then(function(events){
var validated=events.filter(validateEvent);
var normalized=validated.map(normalizeEvent);
var deduplicated=deduplicateEvents(normalized);
return deduplicated;
},function(error){
return $q.reject(error);
});
}
function validateEvent(event){
if(!event||!event.eventId||!event.transactionId)return false;
if(!event.amount||event.amount<=0)return false;
if(!event.timestamp)return false;
return true;
}
function normalizeEvent(event){
return{
eventId:event.eventId,
transactionId:event.transactionId,
cardNumber:maskCardNumber(event.cardNumber),
amount:parseFloat(event.amount),
currency:event.currency||'USD',
merchantId:event.merchantId||'',
merchantCategory:event.merchantCategory||'',
timestamp:new Date(event.timestamp),
geoLocation:event.geoLocation||{latitude:0,longitude:0},
deviceFingerprint:event.deviceFingerprint||'',
ipAddress:event.ipAddress||'',
compromisedIndicator:!!event.compromisedIndicator
};
}
function maskCardNumber(cardNumber){
if(!cardNumber)return'****';
var str=cardNumber.toString();
if(str.length<4)return'****';
return'****'+str.slice(-4);
}
function deduplicateEvents(events){
var seen=CacheService.get('processedEventIds')||[];
var unique=events.filter(function(event){
return seen.indexOf(event.eventId)===-1;
});
unique.forEach(function(event){
seen.push(event.eventId);
});
if(seen.length>1000)seen=seen.slice(-1000);
CacheService.set('processedEventIds',seen);
return unique;
}
}
})();