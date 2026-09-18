(function(){
'use strict';
angular.module('helpCenterApp').controller('ChatController',['ChatService','AnalyticsService',ChatController]);
function ChatController(ChatService,AnalyticsService){
var vm=this;
vm.chatOpen=false;
vm.messages=[];
vm.userMessage='';
vm.errorMessage='';
vm.toggleChat=toggleChat;
vm.sendMessage=sendMessage;
function toggleChat(){
vm.chatOpen=!vm.chatOpen;
if(vm.chatOpen){
AnalyticsService.trackEvent('chat-opened');
if(vm.messages.length===0){
vm.messages.push({sender:'bot',text:'Hello! How can I help you today?',timestamp:new Date()});
}
}else{
AnalyticsService.trackEvent('chat-closed');
}
}
function sendMessage(){
if(!vm.userMessage||vm.userMessage.trim()===''){
return;
}
var userMsg={sender:'user',text:vm.userMessage,timestamp:new Date()};
vm.messages.push(userMsg);
var query=vm.userMessage;
vm.userMessage='';
vm.errorMessage='';
ChatService.sendMessage(query).then(function(response){
var botMsg={sender:'bot',text:response.text,links:response.links||[],timestamp:new Date()};
vm.messages.push(botMsg);
AnalyticsService.trackEvent('chat-message-sent',{query:query});
}).catch(function(err){
vm.errorMessage='Chat assistant is temporarily unavailable. Please try again or browse help articles.';
var errorMsg={sender:'bot',text:'Sorry, I am currently unavailable. Please browse our help articles or contact support.',timestamp:new Date()};
vm.messages.push(errorMsg);
});
}
}
})();