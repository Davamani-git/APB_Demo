(function () {
    'use strict';

    function UserAccountModel(data) {
        data = data || {};
        this.accountId = data.accountId || '';
        this.maskedAccountNumber = data.maskedAccountNumber || '';
        this.currencyCode = data.currencyCode || 'USD';
        this.displayLabel = data.displayLabel || '';
    }

    function UserAccountModelFactory() {
        return UserAccountModel;
    }

    angular
        .module('app')
        .factory('UserAccountModel', UserAccountModelFactory);
})();
