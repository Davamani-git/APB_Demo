(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .service('DataService', DataService);

  function DataService() {
    var service = this;

    var creditCards = [
      {
        id: 1,
        cardName: 'Credit Card 1',
        bank: 'Europe Bank',
        cardNumber: 'XXXX-XXXX-XXXX-4567',
        creditLimit: 50000,
        availableCredit: 32000,
        outstanding: 18000,
        billingDate: '5',
        dueDate: '25'
      },
      {
        id: 2,
        cardName: 'Credit Card 2',
        bank: 'Europe Bank',
        cardNumber: 'XXXX-XXXX-XXXX-6789',
        creditLimit: 30000,
        availableCredit: 18000,
        outstanding: 12000,
        billingDate: '10',
        dueDate: '30'
      },
      {
        id: 3,
        cardName: 'Credit Card 3',
        bank: 'Europe Bank',
        cardNumber: 'XXXX-XXXX-XXXX-9876',
        creditLimit: 2000,
        availableCredit: 1300,
        outstanding: 700,
        billingDate: '12',
        dueDate: '2'
      }
    ];

    var transactions = [
      { id: 1, cardId: 1, cardName: 'Credit Card 1', merchant: 'Amazon Spain', category: 'Shopping', amount: 129.99, date: '2025-07-15T10:14:00', description: 'Electronics accessories purchase', status: 'Posted', reference: 'TXN-0001', auditTimestamp: '2025-07-15T10:16:10' },
      { id: 2, cardId: 2, cardName: 'Credit Card 2', merchant: 'PcComponentes', category: 'Electronics', amount: 849.00, date: '2025-07-02T13:12:00', description: 'Laptop component order', status: 'Posted', reference: 'TXN-0002', auditTimestamp: '2025-07-02T13:14:08' },
      { id: 3, cardId: 1, cardName: 'Credit Card 1', merchant: 'Glovo', category: 'Food Delivery', amount: 18.40, date: '2025-06-28T21:05:00', description: 'Dinner delivery order', status: 'Posted', reference: 'TXN-0003', auditTimestamp: '2025-06-28T21:06:11' },
      { id: 4, cardId: 3, cardName: 'Credit Card 3', merchant: 'Just Eat Spain', category: 'Food Delivery', amount: 27.60, date: '2025-06-25T20:22:00', description: 'Family meal delivery', status: 'Posted', reference: 'TXN-0004', auditTimestamp: '2025-06-25T20:25:54' },
      { id: 5, cardId: 2, cardName: 'Credit Card 2', merchant: 'Uber', category: 'Transport', amount: 14.95, date: '2025-06-18T08:13:00', description: 'Airport transfer ride', status: 'Posted', reference: 'TXN-0005', auditTimestamp: '2025-06-18T08:15:44' },
      { id: 6, cardId: 1, cardName: 'Credit Card 1', merchant: 'Cabify', category: 'Transport', amount: 22.10, date: '2025-06-17T22:48:00', description: 'Late evening city ride', status: 'Posted', reference: 'TXN-0006', auditTimestamp: '2025-06-17T22:50:21' },
      { id: 7, cardId: 2, cardName: 'Credit Card 2', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 299.99, date: '2025-06-10T18:31:00', description: 'Wireless headset purchase', status: 'Posted', reference: 'TXN-0007', auditTimestamp: '2025-06-10T18:33:15' },
      { id: 8, cardId: 1, cardName: 'Credit Card 1', merchant: 'Mercadona Online', category: 'Groceries', amount: 96.75, date: '2025-06-09T11:19:00', description: 'Weekly grocery order', status: 'Posted', reference: 'TXN-0008', auditTimestamp: '2025-06-09T11:21:36' },
      { id: 9, cardId: 2, cardName: 'Credit Card 2', merchant: 'Entradas', category: 'Entertainment', amount: 120.00, date: '2025-06-05T16:42:00', description: 'Concert ticket booking', status: 'Posted', reference: 'TXN-0009', auditTimestamp: '2025-06-05T16:43:42' },
      { id: 10, cardId: 1, cardName: 'Credit Card 1', merchant: 'eDreams', category: 'Travel', amount: 410.50, date: '2025-05-29T09:22:00', description: 'Flight booking to Paris', status: 'Posted', reference: 'TXN-0010', auditTimestamp: '2025-05-29T09:24:08' },
      { id: 11, cardId: 3, cardName: 'Credit Card 3', merchant: 'PromoFarma', category: 'Health', amount: 34.20, date: '2025-05-27T14:55:00', description: 'Pharmacy essentials order', status: 'Posted', reference: 'TXN-0011', auditTimestamp: '2025-05-27T14:56:18' },
      { id: 12, cardId: 2, cardName: 'Credit Card 2', merchant: 'Worten', category: 'Home', amount: 159.90, date: '2025-05-20T17:05:00', description: 'Small appliance purchase', status: 'Posted', reference: 'TXN-0012', auditTimestamp: '2025-05-20T17:08:01' },
      { id: 13, cardId: 1, cardName: 'Credit Card 1', merchant: 'Amazon Spain', category: 'Shopping', amount: 56.80, date: '2025-05-18T12:44:00', description: 'Books and home items', status: 'Posted', reference: 'TXN-0013', auditTimestamp: '2025-05-18T12:46:21' },
      { id: 14, cardId: 2, cardName: 'Credit Card 2', merchant: 'Glovo', category: 'Food Delivery', amount: 15.70, date: '2025-05-17T20:08:00', description: 'Quick lunch delivery', status: 'Posted', reference: 'TXN-0014', auditTimestamp: '2025-05-17T20:09:17' },
      { id: 15, cardId: 1, cardName: 'Credit Card 1', merchant: 'Uber', category: 'Transport', amount: 9.85, date: '2025-05-16T08:03:00', description: 'Office commute', status: 'Posted', reference: 'TXN-0015', auditTimestamp: '2025-05-16T08:05:31' },
      { id: 16, cardId: 2, cardName: 'Credit Card 2', merchant: 'Mercadona Online', category: 'Groceries', amount: 88.12, date: '2025-05-12T10:25:00', description: 'Biweekly grocery basket', status: 'Posted', reference: 'TXN-0016', auditTimestamp: '2025-05-12T10:27:09' },
      { id: 17, cardId: 3, cardName: 'Credit Card 3', merchant: 'Cabify', category: 'Transport', amount: 13.20, date: '2025-05-10T22:12:00', description: 'Station pickup ride', status: 'Posted', reference: 'TXN-0017', auditTimestamp: '2025-05-10T22:13:41' },
      { id: 18, cardId: 1, cardName: 'Credit Card 1', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 74.99, date: '2025-05-05T19:11:00', description: 'Smart home accessory', status: 'Posted', reference: 'TXN-0018', auditTimestamp: '2025-05-05T19:12:55' },
      { id: 19, cardId: 2, cardName: 'Credit Card 2', merchant: 'Entradas', category: 'Entertainment', amount: 65.00, date: '2025-05-03T15:27:00', description: 'Cinema tickets', status: 'Posted', reference: 'TXN-0019', auditTimestamp: '2025-05-03T15:28:22' },
      { id: 20, cardId: 1, cardName: 'Credit Card 1', merchant: 'PcComponentes', category: 'Electronics', amount: 219.45, date: '2025-04-29T13:51:00', description: 'Monitor arm and accessories', status: 'Posted', reference: 'TXN-0020', auditTimestamp: '2025-04-29T13:52:44' },
      { id: 21, cardId: 1, cardName: 'Credit Card 1', merchant: 'Amazon Spain', category: 'Shopping', amount: 38.90, date: '2025-04-26T09:41:00', description: 'Office supplies order', status: 'Posted', reference: 'TXN-0021', auditTimestamp: '2025-04-26T09:42:10' },
      { id: 22, cardId: 2, cardName: 'Credit Card 2', merchant: 'Just Eat Spain', category: 'Food Delivery', amount: 24.50, date: '2025-04-24T21:16:00', description: 'Weekend dinner order', status: 'Posted', reference: 'TXN-0022', auditTimestamp: '2025-04-24T21:18:02' },
      { id: 23, cardId: 3, cardName: 'Credit Card 3', merchant: 'PromoFarma', category: 'Health', amount: 19.95, date: '2025-04-21T11:05:00', description: 'Personal care products', status: 'Posted', reference: 'TXN-0023', auditTimestamp: '2025-04-21T11:06:27' },
      { id: 24, cardId: 2, cardName: 'Credit Card 2', merchant: 'eDreams', category: 'Travel', amount: 289.99, date: '2025-04-17T16:34:00', description: 'Hotel reservation deposit', status: 'Posted', reference: 'TXN-0024', auditTimestamp: '2025-04-17T16:35:49' },
      { id: 25, cardId: 1, cardName: 'Credit Card 1', merchant: 'Worten', category: 'Home', amount: 249.00, date: '2025-04-13T12:57:00', description: 'Vacuum cleaner purchase', status: 'Posted', reference: 'TXN-0025', auditTimestamp: '2025-04-13T12:59:01' },
      { id: 26, cardId: 2, cardName: 'Credit Card 2', merchant: 'Uber', category: 'Transport', amount: 17.30, date: '2025-04-10T07:45:00', description: 'Morning airport ride', status: 'Posted', reference: 'TXN-0026', auditTimestamp: '2025-04-10T07:46:12' },
      { id: 27, cardId: 1, cardName: 'Credit Card 1', merchant: 'Mercadona Online', category: 'Groceries', amount: 102.43, date: '2025-04-08T10:18:00', description: 'Household grocery stock-up', status: 'Posted', reference: 'TXN-0027', auditTimestamp: '2025-04-08T10:19:33' },
      { id: 28, cardId: 1, cardName: 'Credit Card 1', merchant: 'Entradas', category: 'Entertainment', amount: 90.00, date: '2025-04-06T18:50:00', description: 'Theatre ticket booking', status: 'Posted', reference: 'TXN-0028', auditTimestamp: '2025-04-06T18:51:24' },
      { id: 29, cardId: 2, cardName: 'Credit Card 2', merchant: 'Glovo', category: 'Food Delivery', amount: 16.20, date: '2025-03-30T20:40:00', description: 'Snacks delivery', status: 'Posted', reference: 'TXN-0029', auditTimestamp: '2025-03-30T20:42:16' },
      { id: 30, cardId: 3, cardName: 'Credit Card 3', merchant: 'Cabify', category: 'Transport', amount: 11.75, date: '2025-03-28T23:03:00', description: 'Short city ride', status: 'Posted', reference: 'TXN-0030', auditTimestamp: '2025-03-28T23:05:08' },
      { id: 31, cardId: 2, cardName: 'Credit Card 2', merchant: 'Amazon Spain', category: 'Shopping', amount: 74.60, date: '2025-03-25T13:27:00', description: 'Home storage items', status: 'Posted', reference: 'TXN-0031', auditTimestamp: '2025-03-25T13:28:35' },
      { id: 32, cardId: 1, cardName: 'Credit Card 1', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 620.00, date: '2025-03-20T17:48:00', description: 'Tablet device purchase', status: 'Posted', reference: 'TXN-0032', auditTimestamp: '2025-03-20T17:49:58' },
      { id: 33, cardId: 2, cardName: 'Credit Card 2', merchant: 'PromoFarma', category: 'Health', amount: 42.10, date: '2025-03-16T15:03:00', description: 'Supplements and vitamins', status: 'Posted', reference: 'TXN-0033', auditTimestamp: '2025-03-16T15:04:15' },
      { id: 34, cardId: 1, cardName: 'Credit Card 1', merchant: 'Uber', category: 'Transport', amount: 12.60, date: '2025-03-12T09:06:00', description: 'Client meeting commute', status: 'Posted', reference: 'TXN-0034', auditTimestamp: '2025-03-12T09:07:39' },
      { id: 35, cardId: 2, cardName: 'Credit Card 2', merchant: 'eDreams', category: 'Travel', amount: 520.35, date: '2025-03-08T10:26:00', description: 'Roundtrip flight reservation', status: 'Posted', reference: 'TXN-0035', auditTimestamp: '2025-03-08T10:27:52' },
      { id: 36, cardId: 1, cardName: 'Credit Card 1', merchant: 'Worten', category: 'Home', amount: 89.95, date: '2025-03-05T18:01:00', description: 'Kitchen gadgets purchase', status: 'Posted', reference: 'TXN-0036', auditTimestamp: '2025-03-05T18:03:06' },
      { id: 37, cardId: 2, cardName: 'Credit Card 2', merchant: 'Mercadona Online', category: 'Groceries', amount: 92.11, date: '2025-03-02T11:29:00', description: 'Grocery delivery order', status: 'Posted', reference: 'TXN-0037', auditTimestamp: '2025-03-02T11:30:40' },
      { id: 38, cardId: 1, cardName: 'Credit Card 1', merchant: 'Just Eat Spain', category: 'Food Delivery', amount: 21.95, date: '2025-02-27T20:34:00', description: 'Takeaway dinner', status: 'Posted', reference: 'TXN-0038', auditTimestamp: '2025-02-27T20:35:58' },
      { id: 39, cardId: 3, cardName: 'Credit Card 3', merchant: 'Amazon Spain', category: 'Shopping', amount: 23.40, date: '2025-02-24T10:12:00', description: 'Mobile accessories', status: 'Posted', reference: 'TXN-0039', auditTimestamp: '2025-02-24T10:13:21' },
      { id: 40, cardId: 2, cardName: 'Credit Card 2', merchant: 'Entradas', category: 'Entertainment', amount: 49.90, date: '2025-02-21T16:16:00', description: 'Museum pass booking', status: 'Posted', reference: 'TXN-0040', auditTimestamp: '2025-02-21T16:17:09' },
      { id: 41, cardId: 1, cardName: 'Credit Card 1', merchant: 'Glovo', category: 'Food Delivery', amount: 13.80, date: '2025-02-18T19:43:00', description: 'Coffee and snacks order', status: 'Posted', reference: 'TXN-0041', auditTimestamp: '2025-02-18T19:44:11' },
      { id: 42, cardId: 2, cardName: 'Credit Card 2', merchant: 'PcComponentes', category: 'Electronics', amount: 115.70, date: '2025-02-16T14:33:00', description: 'Keyboard and mouse upgrade', status: 'Posted', reference: 'TXN-0042', auditTimestamp: '2025-02-16T14:35:04' },
      { id: 43, cardId: 1, cardName: 'Credit Card 1', merchant: 'Cabify', category: 'Transport', amount: 19.90, date: '2025-02-12T21:56:00', description: 'Dinner event transfer', status: 'Posted', reference: 'TXN-0043', auditTimestamp: '2025-02-12T21:57:50' },
      { id: 44, cardId: 2, cardName: 'Credit Card 2', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 49.99, date: '2025-02-09T17:05:00', description: 'USB hub and adapters', status: 'Posted', reference: 'TXN-0044', auditTimestamp: '2025-02-09T17:06:41' },
      { id: 45, cardId: 1, cardName: 'Credit Card 1', merchant: 'PromoFarma', category: 'Health', amount: 28.30, date: '2025-02-06T12:12:00', description: 'Wellness products order', status: 'Posted', reference: 'TXN-0045', auditTimestamp: '2025-02-06T12:14:17' },
      { id: 46, cardId: 2, cardName: 'Credit Card 2', merchant: 'eDreams', category: 'Travel', amount: 188.00, date: '2025-01-30T09:19:00', description: 'Weekend trip reservation', status: 'Posted', reference: 'TXN-0046', auditTimestamp: '2025-01-30T09:20:39' },
      { id: 47, cardId: 1, cardName: 'Credit Card 1', merchant: 'Mercadona Online', category: 'Groceries', amount: 84.67, date: '2025-01-28T10:41:00', description: 'Grocery essentials', status: 'Posted', reference: 'TXN-0047', auditTimestamp: '2025-01-28T10:43:15' },
      { id: 48, cardId: 3, cardName: 'Credit Card 3', merchant: 'Uber', category: 'Transport', amount: 8.95, date: '2025-01-26T08:01:00', description: 'Train station ride', status: 'Posted', reference: 'TXN-0048', auditTimestamp: '2025-01-26T08:02:12' },
      { id: 49, cardId: 2, cardName: 'Credit Card 2', merchant: 'Amazon Spain', category: 'Shopping', amount: 140.25, date: '2025-01-23T11:58:00', description: 'Winter clothing order', status: 'Posted', reference: 'TXN-0049', auditTimestamp: '2025-01-23T12:00:24' },
      { id: 50, cardId: 1, cardName: 'Credit Card 1', merchant: 'Worten', category: 'Home', amount: 69.90, date: '2025-01-20T18:39:00', description: 'Lamp and lighting accessories', status: 'Posted', reference: 'TXN-0050', auditTimestamp: '2025-01-20T18:40:52' },
      { id: 51, cardId: 1, cardName: 'Credit Card 1', merchant: 'Just Eat Spain', category: 'Food Delivery', amount: 19.50, date: '2025-01-18T20:06:00', description: 'Midweek dinner delivery', status: 'Posted', reference: 'TXN-0051', auditTimestamp: '2025-01-18T20:07:18' },
      { id: 52, cardId: 2, cardName: 'Credit Card 2', merchant: 'Entradas', category: 'Entertainment', amount: 75.00, date: '2025-01-15T15:49:00', description: 'Live event ticket purchase', status: 'Posted', reference: 'TXN-0052', auditTimestamp: '2025-01-15T15:51:41' },
      { id: 53, cardId: 1, cardName: 'Credit Card 1', merchant: 'Glovo', category: 'Food Delivery', amount: 12.75, date: '2025-01-11T19:17:00', description: 'Dessert delivery', status: 'Posted', reference: 'TXN-0053', auditTimestamp: '2025-01-11T19:18:36' },
      { id: 54, cardId: 2, cardName: 'Credit Card 2', merchant: 'PcComponentes', category: 'Electronics', amount: 340.00, date: '2025-01-07T13:23:00', description: 'Storage upgrade purchase', status: 'Posted', reference: 'TXN-0054', auditTimestamp: '2025-01-07T13:25:02' },
      { id: 55, cardId: 3, cardName: 'Credit Card 3', merchant: 'PromoFarma', category: 'Health', amount: 25.80, date: '2025-01-04T10:10:00', description: 'Winter care products', status: 'Posted', reference: 'TXN-0055', auditTimestamp: '2025-01-04T10:11:31' },
      { id: 56, cardId: 1, cardName: 'Credit Card 1', merchant: 'Amazon Spain', category: 'Shopping', amount: 210.00, date: '2024-12-29T16:00:00', description: 'Holiday gift shopping', status: 'Posted', reference: 'TXN-0056', auditTimestamp: '2024-12-29T16:02:14' },
      { id: 57, cardId: 2, cardName: 'Credit Card 2', merchant: 'Mercadona Online', category: 'Groceries', amount: 110.55, date: '2024-12-27T11:25:00', description: 'Festive grocery basket', status: 'Posted', reference: 'TXN-0057', auditTimestamp: '2024-12-27T11:26:50' },
      { id: 58, cardId: 1, cardName: 'Credit Card 1', merchant: 'Uber', category: 'Transport', amount: 16.75, date: '2024-12-24T22:31:00', description: 'Holiday dinner commute', status: 'Posted', reference: 'TXN-0058', auditTimestamp: '2024-12-24T22:32:45' },
      { id: 59, cardId: 2, cardName: 'Credit Card 2', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 980.00, date: '2024-12-21T17:44:00', description: 'Television purchase', status: 'Posted', reference: 'TXN-0059', auditTimestamp: '2024-12-21T17:46:33' },
      { id: 60, cardId: 1, cardName: 'Credit Card 1', merchant: 'Entradas', category: 'Entertainment', amount: 150.00, date: '2024-12-19T14:37:00', description: 'Festival ticket package', status: 'Posted', reference: 'TXN-0060', auditTimestamp: '2024-12-19T14:39:05' },
      { id: 61, cardId: 2, cardName: 'Credit Card 2', merchant: 'eDreams', category: 'Travel', amount: 640.00, date: '2024-12-14T09:12:00', description: 'Holiday travel booking', status: 'Posted', reference: 'TXN-0061', auditTimestamp: '2024-12-14T09:13:48' },
      { id: 62, cardId: 1, cardName: 'Credit Card 1', merchant: 'Worten', category: 'Home', amount: 130.00, date: '2024-12-11T18:21:00', description: 'Heater purchase', status: 'Posted', reference: 'TXN-0062', auditTimestamp: '2024-12-11T18:22:49' },
      { id: 63, cardId: 3, cardName: 'Credit Card 3', merchant: 'Cabify', category: 'Transport', amount: 10.65, date: '2024-12-09T23:12:00', description: 'Holiday shopping return ride', status: 'Posted', reference: 'TXN-0063', auditTimestamp: '2024-12-09T23:13:54' },
      { id: 64, cardId: 2, cardName: 'Credit Card 2', merchant: 'Just Eat Spain', category: 'Food Delivery', amount: 31.40, date: '2024-11-28T20:55:00', description: 'Group dinner order', status: 'Posted', reference: 'TXN-0064', auditTimestamp: '2024-11-28T20:57:09' },
      { id: 65, cardId: 1, cardName: 'Credit Card 1', merchant: 'Amazon Spain', category: 'Shopping', amount: 95.45, date: '2024-11-25T13:13:00', description: 'Black Friday accessories', status: 'Posted', reference: 'TXN-0065', auditTimestamp: '2024-11-25T13:15:11' },
      { id: 66, cardId: 2, cardName: 'Credit Card 2', merchant: 'PcComponentes', category: 'Electronics', amount: 425.90, date: '2024-11-22T15:48:00', description: 'Monitor purchase', status: 'Posted', reference: 'TXN-0066', auditTimestamp: '2024-11-22T15:49:44' },
      { id: 67, cardId: 1, cardName: 'Credit Card 1', merchant: 'Mercadona Online', category: 'Groceries', amount: 91.82, date: '2024-11-18T10:34:00', description: 'Monthly family groceries', status: 'Posted', reference: 'TXN-0067', auditTimestamp: '2024-11-18T10:35:52' },
      { id: 68, cardId: 2, cardName: 'Credit Card 2', merchant: 'Glovo', category: 'Food Delivery', amount: 17.90, date: '2024-11-15T19:24:00', description: 'Fast dinner delivery', status: 'Posted', reference: 'TXN-0068', auditTimestamp: '2024-11-15T19:25:22' },
      { id: 69, cardId: 1, cardName: 'Credit Card 1', merchant: 'Uber', category: 'Transport', amount: 11.40, date: '2024-11-12T08:09:00', description: 'Morning commute', status: 'Posted', reference: 'TXN-0069', auditTimestamp: '2024-11-12T08:10:08' },
      { id: 70, cardId: 2, cardName: 'Credit Card 2', merchant: 'PromoFarma', category: 'Health', amount: 39.70, date: '2024-11-08T12:22:00', description: 'Health care basket', status: 'Posted', reference: 'TXN-0070', auditTimestamp: '2024-11-08T12:23:46' },
      { id: 71, cardId: 1, cardName: 'Credit Card 1', merchant: 'Entradas', category: 'Entertainment', amount: 58.00, date: '2024-10-30T17:33:00', description: 'Sports event ticket', status: 'Posted', reference: 'TXN-0071', auditTimestamp: '2024-10-30T17:35:40' },
      { id: 72, cardId: 2, cardName: 'Credit Card 2', merchant: 'eDreams', category: 'Travel', amount: 330.60, date: '2024-10-27T09:17:00', description: 'Domestic flight reservation', status: 'Posted', reference: 'TXN-0072', auditTimestamp: '2024-10-27T09:18:59' },
      { id: 73, cardId: 1, cardName: 'Credit Card 1', merchant: 'Worten', category: 'Home', amount: 112.30, date: '2024-10-24T18:09:00', description: 'Home office furniture item', status: 'Posted', reference: 'TXN-0073', auditTimestamp: '2024-10-24T18:11:16' },
      { id: 74, cardId: 3, cardName: 'Credit Card 3', merchant: 'Amazon Spain', category: 'Shopping', amount: 31.25, date: '2024-10-21T12:58:00', description: 'Portable charger order', status: 'Posted', reference: 'TXN-0074', auditTimestamp: '2024-10-21T13:00:03' },
      { id: 75, cardId: 2, cardName: 'Credit Card 2', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 210.90, date: '2024-10-18T16:20:00', description: 'Smart speaker purchase', status: 'Posted', reference: 'TXN-0075', auditTimestamp: '2024-10-18T16:21:52' },
      { id: 76, cardId: 1, cardName: 'Credit Card 1', merchant: 'Cabify', category: 'Transport', amount: 14.50, date: '2024-10-14T21:30:00', description: 'Dinner night transport', status: 'Posted', reference: 'TXN-0076', auditTimestamp: '2024-10-14T21:32:29' },
      { id: 77, cardId: 2, cardName: 'Credit Card 2', merchant: 'Just Eat Spain', category: 'Food Delivery', amount: 22.75, date: '2024-10-10T20:11:00', description: 'Pizza night order', status: 'Posted', reference: 'TXN-0077', auditTimestamp: '2024-10-10T20:13:40' },
      { id: 78, cardId: 1, cardName: 'Credit Card 1', merchant: 'Mercadona Online', category: 'Groceries', amount: 87.66, date: '2024-09-28T10:47:00', description: 'Family grocery refill', status: 'Posted', reference: 'TXN-0078', auditTimestamp: '2024-09-28T10:48:28' },
      { id: 79, cardId: 2, cardName: 'Credit Card 2', merchant: 'Glovo', category: 'Food Delivery', amount: 14.90, date: '2024-09-24T19:52:00', description: 'Evening snack order', status: 'Posted', reference: 'TXN-0079', auditTimestamp: '2024-09-24T19:53:46' },
      { id: 80, cardId: 1, cardName: 'Credit Card 1', merchant: 'Uber', category: 'Transport', amount: 13.10, date: '2024-09-21T08:16:00', description: 'Business district ride', status: 'Posted', reference: 'TXN-0080', auditTimestamp: '2024-09-21T08:17:39' },
      { id: 81, cardId: 2, cardName: 'Credit Card 2', merchant: 'PromoFarma', category: 'Health', amount: 47.25, date: '2024-09-18T14:42:00', description: 'Skincare order', status: 'Posted', reference: 'TXN-0081', auditTimestamp: '2024-09-18T14:43:58' },
      { id: 82, cardId: 1, cardName: 'Credit Card 1', merchant: 'Amazon Spain', category: 'Shopping', amount: 67.70, date: '2024-09-15T11:39:00', description: 'Desk accessories purchase', status: 'Posted', reference: 'TXN-0082', auditTimestamp: '2024-09-15T11:40:37' },
      { id: 83, cardId: 2, cardName: 'Credit Card 2', merchant: 'Entradas', category: 'Entertainment', amount: 82.00, date: '2024-09-11T16:51:00', description: 'Comedy show tickets', status: 'Posted', reference: 'TXN-0083', auditTimestamp: '2024-09-11T16:52:44' },
      { id: 84, cardId: 1, cardName: 'Credit Card 1', merchant: 'PcComponentes', category: 'Electronics', amount: 145.50, date: '2024-09-07T13:08:00', description: 'Printer supplies and cables', status: 'Posted', reference: 'TXN-0084', auditTimestamp: '2024-09-07T13:09:28' },
      { id: 85, cardId: 2, cardName: 'Credit Card 2', merchant: 'Worten', category: 'Home', amount: 98.90, date: '2024-08-29T17:26:00', description: 'Storage shelves purchase', status: 'Posted', reference: 'TXN-0085', auditTimestamp: '2024-08-29T17:27:39' },
      { id: 86, cardId: 1, cardName: 'Credit Card 1', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 399.99, date: '2024-08-25T18:14:00', description: 'Gaming monitor purchase', status: 'Posted', reference: 'TXN-0086', auditTimestamp: '2024-08-25T18:15:48' },
      { id: 87, cardId: 2, cardName: 'Credit Card 2', merchant: 'eDreams', category: 'Travel', amount: 275.45, date: '2024-08-21T09:33:00', description: 'Summer hotel booking', status: 'Posted', reference: 'TXN-0087', auditTimestamp: '2024-08-21T09:35:10' },
      { id: 88, cardId: 1, cardName: 'Credit Card 1', merchant: 'Mercadona Online', category: 'Groceries', amount: 105.20, date: '2024-08-18T10:22:00', description: 'Bulk grocery order', status: 'Posted', reference: 'TXN-0088', auditTimestamp: '2024-08-18T10:23:31' },
      { id: 89, cardId: 3, cardName: 'Credit Card 3', merchant: 'Cabify', category: 'Transport', amount: 12.90, date: '2024-08-15T22:41:00', description: 'Night transfer', status: 'Posted', reference: 'TXN-0089', auditTimestamp: '2024-08-15T22:42:54' },
      { id: 90, cardId: 2, cardName: 'Credit Card 2', merchant: 'Just Eat Spain', category: 'Food Delivery', amount: 26.10, date: '2024-08-12T20:04:00', description: 'Lunch combo order', status: 'Posted', reference: 'TXN-0090', auditTimestamp: '2024-08-12T20:05:16' },
      { id: 91, cardId: 1, cardName: 'Credit Card 1', merchant: 'Amazon Spain', category: 'Shopping', amount: 44.30, date: '2024-08-08T11:17:00', description: 'Back-to-work supplies', status: 'Posted', reference: 'TXN-0091', auditTimestamp: '2024-08-08T11:18:29' },
      { id: 92, cardId: 2, cardName: 'Credit Card 2', merchant: 'Glovo', category: 'Food Delivery', amount: 18.20, date: '2024-08-05T19:36:00', description: 'Dinner delivery order', status: 'Posted', reference: 'TXN-0092', auditTimestamp: '2024-08-05T19:37:57' },
      { id: 93, cardId: 1, cardName: 'Credit Card 1', merchant: 'Uber', category: 'Transport', amount: 10.90, date: '2024-08-02T08:44:00', description: 'Office drop-off', status: 'Posted', reference: 'TXN-0093', auditTimestamp: '2024-08-02T08:45:33' },
      { id: 94, cardId: 2, cardName: 'Credit Card 2', merchant: 'PromoFarma', category: 'Health', amount: 21.30, date: '2024-07-30T13:27:00', description: 'Travel-size care products', status: 'Posted', reference: 'TXN-0094', auditTimestamp: '2024-07-30T13:28:40' },
      { id: 95, cardId: 1, cardName: 'Credit Card 1', merchant: 'Entradas', category: 'Entertainment', amount: 68.00, date: '2024-07-26T16:49:00', description: 'Cinema premium booking', status: 'Posted', reference: 'TXN-0095', auditTimestamp: '2024-07-26T16:50:58' },
      { id: 96, cardId: 2, cardName: 'Credit Card 2', merchant: 'PcComponentes', category: 'Electronics', amount: 189.95, date: '2024-07-22T14:51:00', description: 'Webcam and microphone set', status: 'Posted', reference: 'TXN-0096', auditTimestamp: '2024-07-22T14:53:20' },
      { id: 97, cardId: 1, cardName: 'Credit Card 1', merchant: 'Worten', category: 'Home', amount: 76.40, date: '2024-07-18T17:38:00', description: 'Kitchen storage solutions', status: 'Posted', reference: 'TXN-0097', auditTimestamp: '2024-07-18T17:40:01' },
      { id: 98, cardId: 2, cardName: 'Credit Card 2', merchant: 'MediaMarkt Digital', category: 'Electronics', amount: 129.90, date: '2024-07-14T18:05:00', description: 'Bluetooth speaker purchase', status: 'Posted', reference: 'TXN-0098', auditTimestamp: '2024-07-14T18:06:24' },
      { id: 99, cardId: 1, cardName: 'Credit Card 1', merchant: 'Mercadona Online', category: 'Groceries', amount: 89.55, date: '2024-07-10T10:14:00', description: 'Weekly groceries order', status: 'Posted', reference: 'TXN-0099', auditTimestamp: '2024-07-10T10:15:47' },
      { id: 100, cardId: 3, cardName: 'Credit Card 3', merchant: 'Cabify', category: 'Transport', amount: 9.90, date: '2024-07-06T21:58:00', description: 'City center return ride', status: 'Posted', reference: 'TXN-0100', auditTimestamp: '2024-07-06T22:00:12' }
    ];

    service.getCreditCards = function () {
      return angular.copy(creditCards);
    };

    service.getTransactions = function () {
      return transactions.map(function (tx) {
        var copy = angular.copy(tx);
        copy.date = new Date(copy.date);
        copy.auditTimestamp = new Date(copy.auditTimestamp);
        return copy;
      });
    };

    service.getCategories = function () {
      var categories = {};
      transactions.forEach(function (tx) {
        categories[tx.category] = true;
      });
      return Object.keys(categories).sort();
    };

    service.getMonthlySpendSeries = function (txs) {
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var grouped = {};
      var sortedMonths = [];

      txs.forEach(function (tx) {
        var date = new Date(tx.date);
        var key = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
        if (!grouped[key]) {
          grouped[key] = 0;
        }
        grouped[key] += tx.amount;
      });

      Object.keys(grouped).sort().forEach(function (key) {
        sortedMonths.push({
          key: key,
          label: monthNames[parseInt(key.split('-')[1], 10) - 1] + ' ' + key.split('-')[0],
          value: parseFloat(grouped[key].toFixed(2))
        });
      });

      return {
        labels: sortedMonths.map(function (item) { return item.label; }),
        values: sortedMonths.map(function (item) { return item.value; })
      };
    };

    service.getTopCategories = function (txs, limit) {
      return aggregateTopByField(txs, 'category', limit);
    };

    service.getTopMerchants = function (txs, limit) {
      return aggregateTopByField(txs, 'merchant', limit);
    };

    service.getMonthlyForecast = function (txs) {
      var monthly = {};
      txs.forEach(function (tx) {
        var date = new Date(tx.date);
        var key = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
        if (!monthly[key]) {
          monthly[key] = 0;
        }
        monthly[key] += tx.amount;
      });

      var totals = Object.keys(monthly).sort().slice(-3).map(function (key) {
        return monthly[key];
      });

      if (!totals.length) {
        return 0;
      }

      var average = totals.reduce(function (sum, value) {
        return sum + value;
      }, 0) / totals.length;

      return Math.round(average);
    };

    function aggregateTopByField(txs, field, limit) {
      var grouped = {};
      txs.forEach(function (tx) {
        if (!grouped[tx[field]]) {
          grouped[tx[field]] = 0;
        }
        grouped[tx[field]] += tx.amount;
      });

      var ranked = Object.keys(grouped).map(function (key) {
        return {
          label: key,
          value: parseFloat(grouped[key].toFixed(2))
        };
      }).sort(function (a, b) {
        return b.value - a.value;
      }).slice(0, limit || 5);

      return {
        labels: ranked.map(function (item) { return item.label; }),
        values: ranked.map(function (item) { return item.value; })
      };
    }
  }
})();
