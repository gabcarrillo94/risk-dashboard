/* Servicio encargado de hacer las diversas validaciones en las distintas rutas
    del archivo index.route.js */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('Casos', Casos)
    
    Casos.$inject = ['$http', 'Alertas', 'EventosAlerta', 'Comentarios'];
    function Casos($http, Alertas, EventosAlerta, Comentarios) {
      var casos = [
        {id: 1, estado: 'Abierto', nombre: 'Transacciones inusuales', fecha: '2016-06-10', hora: '10:46:57.123', tipo: 'Normal', criticidad: 'Alta', ejecutivo: 'UUrrtia'},
        {id: 2, estado: 'Abierto', nombre: 'Conflicto interés empresas ATR', fecha: '2016-07-10', hora: '10:46:57.123', tipo: 'Normal', criticidad: 'Media', ejecutivo: 'Afirtz'},
        {id: 3, estado: 'Abierto', nombre: 'Caso tres', fecha: '2016-08-10', hora: '10:46:57.123', tipo: 'Normal', criticidad: 'Alta', ejecutivo: 'PVillal'},
        {id: 4, estado: 'Abierto', nombre: 'Caso cuatro', fecha: '2016-09-10', hora: '10:46:57.123', tipo: 'Normal', criticidad: 'Baja', ejecutivo: 'UUrrtia'}
      ];
    
      var archivosCaso = [];
      archivosCaso['1'] = [
        {name: 'archivo.docx', url:'http://localhost/archivo.docx', uploadedBy: 'HTasd', fecha: '2016-06-10', hora: '10:56:45.213'},
        {name: 'archivo_2.docx', url:'http://localhost/archivo_2.docx', uploadedBy: 'Pepe', fecha: '2016-06-11', hora: '16:15:00.001'}];
      archivosCaso['2'] = [
        {name: 'archivo1.docx', url:'http://localhost/archivo1.docx', uploadedBy: 'UUrrtia', fecha: '2016-06-10', hora: '10:56:45.213'},
        {name: 'archivo_1_2.docx', url:'http://localhost/archivo_1_2.docx', uploadedBy: 'JGomez', fecha: '2016-06-11', hora: '16:15:00.001'}];
      archivosCaso['3'] = [
        {name: 'archivo3.docx', url:'http://localhost/archivo3.docx', uploadedBy: 'PVillal', fecha: '2016-06-10', hora: '10:56:45.213'},
        {name: 'archivo_3_2.docx', url:'http://localhost/archivo_3_2.docx', uploadedBy: 'Afirtz', fecha: '2016-06-11', hora: '16:15:00.001'}];
      archivosCaso['4'] = [
        {name: 'archivo4.docx', url:'http://localhost/archivo1.docx', uploadedBy: 'UUrrtia', fecha: '2016-06-10', hora: '10:56:45.213'},
        {name: 'archivo_4_2.docx', url:'http://localhost/archivo_1_2.docx', uploadedBy: 'JGomez', fecha: '2016-06-11', hora: '16:15:00.001'}];
    
      var alertasCasos = [];
      alertasCasos[1] = {alertas: [5, 4]};
      alertasCasos[2] = {alertas: [3]};
      alertasCasos[3] = {alertas: [4]};
      alertasCasos[4] = {alertas: [1, 5]};
      
      var comentarioCasos = [];
      comentarioCasos[1] = {
        uploadedBy: 'HTasd',
        comment: 'Completamente de acuerdo.',
        fecha: '2016-06-10',
        hora: '10:56:45.213'
        };
        comentarioCasos[2] = {
        uploadedBy: 'HTasd',
        comment: 'Completamente de acuerdo con el comentario de arriba.',
        fecha: '2016-06-10',
        hora: '11:02:45.213'
        };
        comentarioCasos[3] = {
        uploadedBy: 'Gcarrillo',
        comment: 'Revisión a la hora actual.',
        fecha: '2016-08-11',
        hora: '10:56:45.213'
        };
        comentarioCasos[4] = {
        uploadedBy: 'Jlopez',
        comment: 'Nueva revisión del caso con subida de archivo.',
        fecha: '2017-01-10',
        hora: '12:56:45.213'
        };
    
      this.obtenerCasosAlerta = function(idAlerta, callback) {
        var checkedCasos = [];
        var casosAlert = [];
        for(var i=1; i<alertasCasos.length; i++) {
          if(!alertasCasos[i]) {
            continue;
          }
          var a_alertas = alertasCasos[i].alertas;
          if(a_alertas) {
            for (var j = 0; j < a_alertas.length; j++) {
              if(a_alertas[j]===idAlerta && !checkedCasos[i]) {
                checkedCasos[i] = i;
                console.log(casos[i-1]);
                casosAlert.push(casos[i-1]);
              }
            }
          }
        }
        callback({header: {code:0}, body: casosAlert});
      };
    
      this.crearCaso = function(casoData, idAlerta, callback) {
        var idNewCaso = casos[casos.length-1].id + 1;
        var newCaso = {id: idNewCaso, nombre: casoData.nombre,
          fecha: '2016-06-10', hora: '10:46:57.123', tipo: 'Normal', estado: 'Abierto',
          criticidad: casoData.criticidad, ejecutivo: casoData.ejecutivo};
          casos.push(newCaso);
          if(idAlerta) {
            if(!alertasCasos[idNewCaso]) {
              alertasCasos[idNewCaso] = {alertas: []};
            }
            alertasCasos[idNewCaso].alertas.push(idAlerta);
          }
        //Se retorna llamado
        callback({header: {code: 0}, body: newCaso});
      };
    
      this.vincularAlertasCaso = function(idCaso, idAlertas, callback) {
        var actualCaso = casos[idCaso];
        if(actualCaso) {
          for(var i=0 ; i<idAlertas.length ; i++) {
            var idNewAlerta = idAlertas[i];
            //se asocia alerta al caso
            alertasCasos[idCaso].alertas.push(idNewAlerta);
          }
        }
        callback({header: {code: 0}});
      };
    
      this.desvincularAlertaCaso = function(idCaso, idAlerta, callback) {
        var actualCaso = casos[idCaso];
        if(actualCaso) {
          var indexDelete = -1;
          for(var i=0 ; i<alertasCasos[idCaso].alertas.length ; i++) {
            if(idAlerta===alertasCasos[idCaso].alertas[i]) {
              indexDelete = i;
              break;
            }
          }
          if(indexDelete>-1) {
            alertasCasos[idCaso].alertas.splice(indexDelete, 1);
          }
          callback({header: {code: 0}});
        }
      };
    
      this.obtenerAlertasCaso = function(idCaso, callback) {
        //Representa un servicio que retorna todas las alertas, con sus eventos y numero de comentarios por evento
        var alertasComments = alertasCasos[idCaso];
        if(alertasComments) {
          var alerts = Alertas.obtenerAlertasByIds(alertasComments.alertas);
          for(var i=0; i<alerts.length; i++) {
            var forAlert = alerts[i];
            var eventos = EventosAlerta.obtenerEventsByIdAlerta(forAlert.id);
            if(eventos) {
              for(var j=0; j<eventos.length; j++) {
                var forEvent = eventos[j];
                if(!forEvent) {
                  continue;
                }
                forEvent.comentariosQty = Comentarios.obtenerQtyComentariosCasoAlertaEvento(idCaso, alerts[i].id, forEvent.id);
              }
              forAlert.eventos = eventos;
            }
          }
          //callback({header: {code: 0}, body: alerts});
          callback({header: {code: 0}, body: JSON.parse(JSON.stringify(alerts))});
        }
      };
    
      this.searchCasos = function(sinceDate, untilDate, callback) {
        callback({header: {code: 0, message: ''}, body: casos});
      };
    
      this.obtenerArchivos = function(idCaso, callback) {
        callback({header: {code: 0, message: ''}, body: archivosCaso[idCaso]});
      };
      
      this.obtenerComentarios = function(idCaso, callback) {
        callback({header: {code: 0, message: ''}, body: comentarioCasos});
      };
    
    }
})();
