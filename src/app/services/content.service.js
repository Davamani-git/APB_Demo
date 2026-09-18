(function(){
'use strict';
angular.module('helpCenterApp').factory('ContentService',['$http','$q',ContentService]);
function ContentService($http,$q){
var service={getCategories:getCategories,getContentByCategory:getContentByCategory};
return service;
function getCategories(){
var mockCategories=[{id:'getting-started',name:'Getting Started'},{id:'faqs',name:'FAQs'},{id:'troubleshooting',name:'Troubleshooting'}];
return $q.resolve(mockCategories);
}
function getContentByCategory(categoryId){
var mockContent={'getting-started':[{id:1,title:'Quick Start Guide',description:'Get started with our platform in minutes.',type:'article',url:'/articles/quick-start'},{id:2,title:'Introduction Video',description:'Watch our introduction video.',type:'video',url:'/videos/intro'}],'faqs':[{id:3,title:'Frequently Asked Questions',description:'Answers to common questions.',type:'article',url:'/articles/faq'},{id:4,title:'FAQ PDF',description:'Download our FAQ document.',type:'download',downloadUrl:'/downloads/faq.pdf'}],'troubleshooting':[{id:5,title:'Common Issues',description:'Troubleshoot common problems.',type:'article',url:'/articles/common-issues'},{id:6,title:'Troubleshooting Video',description:'Video guide for troubleshooting.',type:'video',url:'/videos/troubleshooting'}]};
return $q.resolve(mockContent[categoryId]||[]);
}
}
})();