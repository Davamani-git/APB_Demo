angular.module('creditCardApp').factory('TransactionService',['$q',function($q){
var mockTransactions=[
{id:1,cardId:1,date:'2024-01-15',description:'Grocery Store',amount:-2500,category:'Food & Dining'},
{id:2,cardId:1,date:'2024-01-14',description:'Gas Station',amount:-1200,category:'Fuel'},
{id:3,cardId:1,date:'2024-01-13',description:'Online Shopping',amount:-4500,category:'Shopping'},
{id:4,cardId:2,date:'2024-01-12',description:'Restaurant',amount:-1800,category:'Food & Dining'},
{id:5,cardId:2,date:'2024-01-11',description:'Flight Booking',amount:-8500,category:'Travel'},
{id:6,cardId:3,date:'2024-01-10',description:'Movie Tickets',amount:-600,category:'Entertainment'},
{id:7,cardId:3,date:'2024-01-09',description:'Electricity Bill',amount:-2200,category:'Utilities'},
{id:8,cardId:1,date:'2024-01-08',description:'Pharmacy',amount:-850,category:'Healthcare'},
{id:9,cardId:2,date:'2024-01-07',description:'Online Course',amount:-3500,category:'Education'},
{id:10,cardId:3,date:'2024-01-06',description:'Misc Purchase',amount:-1200,category:'Miscellaneous'},
{id:11,cardId:1,date:'2023-12-28',description:'Grocery Store',amount:-2200,category:'Food & Dining'},
{id:12,cardId:2,date:'2023-12-25',description:'Gas Station',amount:-1100,category:'Fuel'},
{id:13,cardId:3,date:'2023-12-20',description:'Shopping Mall',amount:-5500,category:'Shopping'},
{id:14,cardId:1,date:'2023-11-15',description:'Restaurant',amount:-2000,category:'Food & Dining'},
{id:15,cardId:2,date:'2023-11-10',description:'Hotel Booking',amount:-12000,category:'Travel'}
];
return{
getTransactionsByCard:function(cardId){
var filtered=mockTransactions.filter(function(t){return t.cardId===cardId;});
return $q.resolve(angular.copy(filtered));
},
getAllTransactions:function(){
return $q.resolve(angular.copy(mockTransactions));
}
};
}]);