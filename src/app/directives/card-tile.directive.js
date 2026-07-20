(function () {
    'use strict';

    angular
        .module('app')
        .directive('cardTile', cardTile);

    function cardTile() {
        return {
            restrict: 'E',
            scope: {
                card: '<'
            },
            templateUrl: 'src/templates/directives/card-tile.html',
            controller: function () {},
            controllerAs: 'vm',
            bindToController: true
        };
    }
})();