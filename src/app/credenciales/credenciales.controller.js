(function () {
    'use strict';

    angular
            .module('dashboard')
            .controller('CredencialesController', CredencialesController);

    CredencialesController.$inject = ['$scope', '$state', '$rootScope', 'toastr', '$timeout', '$modal', 'ReportsFactory'];
    
    function CredencialesController($scope, $state, $rootScope, toastr, $timeout, $modal, ReportsFactory) {
        
        $scope.loaderPBI = true;
        $scope.editorPowerBi = false;
        $scope.pbiInfo = {
            active:false,
            username:'',
            orgUsername:'',
        }
        var mostrarAlert = function(tipo, msg) {
            $scope.msgAlert = msg;
            $scope.tipoAlert = tipo;
            $modal({
                templateUrl: 'app/credenciales/alert-credenciales.html',
                backdrop: 'static',
                size: 'md',
                scope: $scope,
                keyboard: true,
            });
        }
        
        var obtenerAcceso = function(){
            ReportsFactory.getAccess()
                .then(function (res) {
                    $scope.pbiInfo = res;
                    $scope.pbiInfo.orgUsername = res.username;
                    $scope.loaderPBI = false;
                    $scope.$apply();
                })
                .catch(function (e) {
                    console.log(e.msg);
                    $scope.loaderPBI = false;
                    $scope.$apply();
                });
        }
        obtenerAcceso();
        
        $scope.guardarCredencialesPBI = function(){
            $scope.loaderPBI = true;
            ReportsFactory.saveCredentials(this.pbiInfo)
                .then(function (res) {
                    mostrarAlert('success', 'Su configuración de credenciales ha sido guardada exitosamente');
                    obtenerAcceso();
                    $scope.loaderPBI = false;
                    $scope.editorPowerBi = false;
                })
                .catch(function (e) {
                    $scope.loaderPBI = false;
                    $scope.$apply();
                    mostrarAlert('error', e.msg);
                });
        }
        $scope.cancelarEdicion = function () {
            if($scope.pbiInfo){
                $scope.pbiInfo.username = $scope.pbiInfo.orgUsername;
            }
            $scope.editorPowerBi = false;
        }
    }
})();