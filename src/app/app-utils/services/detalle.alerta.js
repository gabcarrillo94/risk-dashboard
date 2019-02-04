/* Servicio encargado de hacer las diversas validaciones en las distintas rutas
    del archivo index.route.js */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('DetalleAlerta', DetalleAlerta)
        
    DetalleAlerta.$inject = ['$http'];
    function DetalleAlerta($http) {
    
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
    
        var archivosAlerta = [];
        archivosAlerta['1'] = [
            {name: 'archivo.docx', url:'http://localhost/archivo.docx', uploadedBy: 'HTasd', fecha: '2016-06-10', hora: '10:56:45.213'},
            {name: 'archivo_2.docx', url:'http://localhost/archivo_2.docx', uploadedBy: 'Pepe', fecha: '2016-06-11', hora: '16:15:00.001'}];
        archivosAlerta['2'] = [
            {name: 'archivo1.docx', url:'http://localhost/archivo1.docx', uploadedBy: 'UUrrtia', fecha: '2016-06-10', hora: '10:56:45.213'},
            {name: 'archivo_1_2.docx', url:'http://localhost/archivo_1_2.docx', uploadedBy: 'JGomez', fecha: '2016-06-11', hora: '16:15:00.001'}];
        archivosAlerta['3'] = [
            {name: 'archivo3.docx', url:'http://localhost/archivo3.docx', uploadedBy: 'PVillal', fecha: '2016-06-10', hora: '10:56:45.213'},
            {name: 'archivo_3_2.docx', url:'http://localhost/archivo_3_2.docx', uploadedBy: 'Afirtz', fecha: '2016-06-11', hora: '16:15:00.001'}];
        archivosAlerta['4'] = [
            {name: 'archivo4.docx', url:'http://localhost/archivo4.docx', uploadedBy: 'PVillal', fecha: '2016-06-10', hora: '10:56:45.213'},
            {name: 'archivo_4_2.docx', url:'http://localhost/archivo_4_2.docx', uploadedBy: 'Afirtz', fecha: '2016-06-11', hora: '16:15:00.001'},
            {name: 'archivo_4_3.docx', url:'http://localhost/archivo_4_2.docx', uploadedBy: 'Afirtz', fecha: '2016-06-11', hora: '16:15:00.001'}];
        archivosAlerta['5'] = [
            {name: 'archivo5.docx', url:'http://localhost/archivo3.docx', uploadedBy: 'PVillal', fecha: '2016-06-10', hora: '10:56:45.213'},
            {name: 'archivo_5_2.docx', url:'http://localhost/archivo_3_2.docx', uploadedBy: 'Afirtz', fecha: '2016-06-11', hora: '16:15:00.001'}];
    
      this.obtenerParametros = function(idAlerta, callback) {
        callback({header: {code: 0, message:''}, body: parametrosAlertas[idAlerta]});
      };
    
      this.obtenerArchivos = function(idAlerta, callback) {
        callback({header: {code: 0, message: ''}, body: archivosAlerta[idAlerta]});
      };
    
    }
})();
