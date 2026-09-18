(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionService',['$q',function($q){
var mockTransactions=[{id:'TXN001',cardId:'CC001',date:'2024-01-15',description:'Grocery Store',category:'Food & Dining',amount:2500,merchant:'SuperMart',status:'Completed'},{id:'TXN002',cardId:'CC001',date:'2024-01-18',description:'Fuel Station',category:'Fuel',amount:1200,merchant:'PetroMax',status:'Completed'},{id:'TXN003',cardId:'CC001',date:'2024-01-20',description:'Online Shopping',category:'Shopping',amount:4500,merchant:'ShopZone',status:'Completed'},{id:'TXN004',cardId:'CC002',date:'2024-01-10',description:'Flight Booking',category:'Travel',amount:8000,merchant:'AirTravel',status:'Completed'},{id:'TXN005',cardId:'CC002',date:'2024-01-22',description:'Restaurant',category:'Food & Dining',amount:1800,merchant:'Dine Fine',status:'Completed'},{id:'TXN006',cardId:'CC003',date:'2024-01-12',description:'Movie Tickets',category:'Entertainment',amount:800,merchant:'CineMax',status:'Completed'},{id:'TXN007',cardId:'CC003',date:'2024-01-25',description:'Electricity Bill',category:'Utilities',amount:1500,merchant:'PowerCorp',status:'Completed'},{id:'TXN008',cardId:'CC001',date:'2024-02-05',description:'Pharmacy',category:'Healthcare',amount:950,merchant:'MediPlus',status:'Completed'},{id:'TXN009',cardId:'CC002',date:'2024-02-08',description:'Online Course',category:'Education',amount:3000,merchant:'LearnHub',status:'Completed'},{id:'TXN010',cardId:'CC001',date:'2024-02-12',description:'Miscellaneous',category:'Miscellaneous',amount:600,merchant:'General Store',status:'Completed'}];
function getTransactionsByCardId(cardId){
var filtered=mockTransactions.filter(function(txn){return txn.cardId===cardId;});
return $q.resolve(angular.copy(filtered));
}
function getAllTransactions(){
return $q.resolve(angular.copy(mockTransactions));
}
function getTransactionsByDateRange(startDate,endDate){
var start=new Date(startDate),end=new Date(endDate);
var filtered=mockTransactions.filter(function(txn){
var txnDate=new Date(txn.date);
return txnDate>=start&&txnDate<=end;
});
return $q.resolve(angular.copy(filtered));
}
return{getTransactionsByCardId:getTransactionsByCardId,getAllTransactions:getAllTransactions,getTransactionsByDateRange:getTransactionsByDateRange};
}]);
})();