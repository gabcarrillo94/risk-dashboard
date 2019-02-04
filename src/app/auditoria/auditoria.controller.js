(function () {
    'use strict';

    angular
            .module('dashboard')
            .controller('AuditoriaController', AuditoriaController);

    AuditoriaController.$inject = ['$scope', '$state', '$rootScope', 'moment', '$interval', '$localStorage', '$stateParams'];
    function AuditoriaController($scope, $state, $rootScope, moment, $interval, $localStorage, $stateParams) {
        var vm = this;
        var dateFormat = "YYYY-MM-DD";

        vm.user = $localStorage.currentUser;
        console.log("CONTROLADOR DE AUDITORIA");
        

    }
})();
