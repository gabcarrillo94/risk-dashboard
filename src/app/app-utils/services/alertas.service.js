/* Servicio encargado de hacer las diversas validaciones en las distintas rutas
    del archivo index.route.js */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('Alertas', Alertas)

    Alertas.$inject = ['$http'];
    function Alertas($http) {
    
        var alertas = [
            {id: 1, fecha: '2016-02-15', hora: '16:45:46.213', tipo: 'Incidente', ejecutivo: 'JBurks', criticidad: 'Alta'},
            {id: 2, fecha: '2016-02-16', hora: '16:45:46.213', tipo: 'Notificacion', ejecutivo: 'JBurks', criticidad: 'Baja'},
            {id: 3, fecha: '2016-04-17', hora: '16:45:46.213', tipo: 'Incidente', ejecutivo: 'HBurns', criticidad: 'Baja'},
            {id: 4, fecha: '2016-05-19', hora: '16:45:46.213', tipo: 'Incidente', ejecutivo: 'HBurns', criticidad: 'Media'},
            {id: 5, fecha: '2016-06-01', hora: '18:42:46.213', tipo: 'Incidente', ejecutivo: 'JJones', criticidad: 'Alta'}
        ];
    
        this.obtenerAlertas = function(callback) {
            callback({header: {code: 0, message: ''}, body: alertas});
        };
    
        this.searchAlerts = function(sinceDate, untilDate, callback) {
        //Funcion que permite buscar las alertas a partir de los rangos de fecha
        //TODO si la fecha untilDate es igual a la fecha actual, entonces agregar listener a websocket
            callback({header: {code: 0, message: ''}, body: alertas});
        };
    
        this.obtenerAlertasByIds = function(idAlertas) {
            var arrayResponse = [];
            for(var i=0; i<alertas.length; i++) {
                for(var j=0; j<idAlertas.length; j++) {
                    if(alertas[i].id == idAlertas[j]) {
                        arrayResponse.push(alertas[i]);
                    }
                }
            }
            return arrayResponse.slice();
        }
    }
})();