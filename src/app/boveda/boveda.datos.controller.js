(function () {
    'use strict';

    angular
            .module('dashboard')
            .controller('BovedaDatosController', BovedaDatosController);

    BovedaDatosController.$inject = ['$scope', '$state', '$rootScope', '$interval', '$localStorage', '$stateParams', '$modal', '$http'];
    function BovedaDatosController($scope, $state, $rootScope, $interval, $localStorage, $stateParams, $modal, $http) {
        var vm = this;
        console.log("CONTROLLER BOVEDA DE DATOS");
    }
})();