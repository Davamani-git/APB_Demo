(function () {
    "use strict";

    angular.module("app")
        .service("NotificationService", NotificationService);

    NotificationService.$inject = ["$rootScope"];

    function NotificationService($rootScope) {
        this.showSuccess = function (message) {
            emit("notification:success", message);
        };

        this.showError = function (message) {
            emit("notification:error", message);
        };

        this.showWarning = function (message) {
            emit("notification:warning", message);
        };

        this.showInfo = function (message) {
            emit("notification:info", message);
        };

        function emit(eventName, message) {
            $rootScope.$emit(eventName, {
                message: message
            });
        }
    }
})();
