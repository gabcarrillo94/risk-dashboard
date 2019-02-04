/* Servicio encargado de hacer las diversas validaciones en las distintas rutas
    del archivo index.route.js */

(function() {
'use strict';

  angular
  .module('dashboard')
  .service('RouteService', RouteService)

  RouteService.$inject = ['$q', '$localStorage'];

    function RouteService ($q, $localStorage){
        return {
            profileAuthorized: function(idFuncion){
              if($localStorage.currentUser){
                var currentMenu = $localStorage.currentUser.opcionesMenu.find(function(opcion){
                  return opcion.idFuncion === idFuncion;
                })
                if (!currentMenu){
                    return $q.reject('NotAccess');
                }
              }
            }
          }
        }
      })();
