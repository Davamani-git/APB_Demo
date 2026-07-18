(function () {
    'use strict';

    envConfig.$inject = [];

    angular
        .module('app')
        .config(envConfig);

    function envConfig() {
        // Environment configuration is loaded via EnvConfigService from static JSON files.
        // No run-time HTTP calls in this config block.
    }
})();
