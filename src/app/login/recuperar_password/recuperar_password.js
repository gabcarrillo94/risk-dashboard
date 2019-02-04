(function () {
    'use strict';

    angular
        .module('dashboard')
        .controller('RecuperarPasswordController', RecuperarPasswordController);

    RecuperarPasswordController
    .$inject = ['$scope', '$state', '$rootScope', 
                '$interval', '$localStorage', '$stateParams', 
                '$modal', '$http', 'PasswordResetFactory', 'toastr'];
    function RecuperarPasswordController($scope, $state, $rootScope, 
                                $interval, $localStorage, 
                                $stateParams, $modal, $http,
                                 PasswordResetFactory, toastr) {
        $scope.recovery = {
            password: '',
            password_confirmation: ''
        }

        $scope.show = false;
        $scope.content = '';

        $scope.cambiarPassword = function(){

            $scope.validarCambiarPassword()
            if (!$scope.show){
                $scope.request = true;
                PasswordResetFactory.changePassword(
                    $stateParams.username,
                    $stateParams.token,
                    $scope.recovery.password,
                    $scope.recovery.password_confirmation
                ).then(function(res){
                    toastr.success('Cambio de clave exitoso!');
                    $scope.request = false;
                    $state.go('login');
                }).catch(function(err){
                    $scope.content = 'Token invalido intente recuperar su clave nuevamente'
                    $scope.show = true;
                    $scope.request = false;                    
                    $scope.$apply();
                })
            }
        }


        $scope.validarCambiarPassword = function () {
            var validacion = {content: '', show: false};
            
            if (!$scope.recovery.password) {
                validacion.content = 'Debe llenar el campo Contraseña Nueva.';
                $scope.content = validacion.content;
                validacion.show = true;
                $scope.show = validacion.show;
                return validacion;
            } else if (!$scope.recovery.password_confirmation) {
                validacion.content = 'Debe ser llenar el campo Confirmar Contraseña.';
                $scope.content = validacion.content;
                validacion.show = true;
                $scope.show = validacion.show;
                return validacion;
            } else if ($scope.recovery.password !== $scope.recovery.password_confirmation) {
                validacion.content = 'La contraseñas deben ser iguales.';
                $scope.content = validacion.content;
                validacion.show = true;
                $scope.show = validacion.show;
                return validacion;
            }
            $scope.show = false;
        };
    }
})();