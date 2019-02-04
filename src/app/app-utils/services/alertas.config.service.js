/*  */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('AlertasConfig', AlertasConfig)

    AlertasConfig.$inject = ['$http'];
    function AlertasConfig($http) {
  
      var alertas = [
        {id: 1, nombre: 'Conflicto de interés', tipo: 'Incidente', descripcion: 'Descripcion conflicto de interés', estado: true},
        {id: 2, nombre: 'Sobregiro cuenta', tipo: 'Incidente', descripcion: 'Sobregiro en la cuenta de cliente', estado: true},
        {id: 3, nombre: 'Posible transacción tarjeta clonada', tipo: 'Notificacion', descripcion: 'Posible detección de tarjeta clonada', estado: true},
        {id: 4, nombre: 'Transacción no habitual', tipo: 'Incidente', descripcion: 'Transacción fuera de los rangos habituales de un cliente', estado: true},
        {id: 5, nombre: 'Incidente test', tipo: 'Incidente', descripcion: 'Descripcion.....', estado: true}
      ];
  
      var parametrosAlertas = [];
      parametrosAlertas['1'] = [
        {name: 'parametro1', value:'value1', description: 'description parametro1'},
        {name: 'p2', value: 'value2', description: 'description p2'}];
      parametrosAlertas['2'] = [
        {name: 'parametro8', value:'value1', description: 'description parametro8'},
        {name: 'p6', value: 'value2', description: 'description p6'}];
      parametrosAlertas['3'] = [
        {name: 'param345', value:'value1', description: 'description param345'},
        {name: 'tasa', value: '3.25', description: 'description tasa'}];
      parametrosAlertas['4'] = [
        {name: 'param4', value:'value1', description: 'description param345'},
        {name: 'tasa4', value: '3.25', description: 'description tasa'}];
      parametrosAlertas['5'] = [
        {name: 'param5', value:'value1', description: 'description param345'},
        {name: 'tasa5', value: '3.25', description: 'description tasa'}];
  
      this.obtenerAlertas = function(callback) {
        callback({header: {code:0}, body: alertas});
      }
  
      this.obtenerParametrosAlerta = function(idAlerta, callback) {
        callback({header: {code:0}, body: parametrosAlertas[idAlerta]});
      }
  
      this.obtenerAlertaPorId = function(idAlerta, callback) {
        callback({header: {code:0}, body: getAlertaById(idAlerta)});
      }
  
      function getAlertaById(id) {
        for(var i=0; i<alertas.length; i++) {
          if(alertas[i].id == id) {
            return alertas[i];
          }
        }
        return null;
      }
    }
})();