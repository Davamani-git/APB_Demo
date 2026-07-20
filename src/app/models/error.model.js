(function () {
    'use strict';

    angular.module('apbDemo')
        .factory('ErrorModel', ErrorModelFactory);

    ErrorModelFactory.$inject = [];

    function ErrorModelFactory() {
        function ErrorModel() {
            this.code = null;
            this.message = '';
            this.details = '';
            this.correlationId = '';
        }
        return ErrorModel;
    }
})();
