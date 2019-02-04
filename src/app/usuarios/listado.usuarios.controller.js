(function () {
    'use strict';

    angular
            .module('dashboard')
            .controller('ListadoUsuariosController', ListadoUsuariosController);

    ListadoUsuariosController.$inject = ['$scope', 'listaUsuarios', '$rootScope', '$filter', 'toastr' ];
    function ListadoUsuariosController($scope, listaUsuarios, $rootScope, $filter, toastr) {
        console.log("CONTROLLER LISTADO USUARIOS");
        $scope.listadoUsuariosRoles = listaUsuarios

        $scope.filtrarUsuario = '';


        $scope.busquedaPorFiltro = function(){
            if ($scope.filterUsers.length !== 1){
                toastr.error('Debe seleccionar un registro');
            }else{
                $rootScope.$broadcast('select-user', $scope.filterUsers);
            }
        }

        $scope.closeModalListadoUsuarios = function () {
            $rootScope.$broadcast('close-modal', $scope.filterUsers);
        };
    }

    angular
    .module('dashboard')
    .filter('filterByUsername', function(){
        return function(array, text){
            if (text){
                return array.filter(function(user){
                    return user.riskUser.username.indexOf(text) > -1;
                })
            }
            return array;     
        }
    });



})();