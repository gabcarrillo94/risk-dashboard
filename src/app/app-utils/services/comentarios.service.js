/* */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('Comentarios', Comentarios)    

    Comentarios.$inject = ['$http'];
    function Comentarios($http) {
      var comentarios = [];
      //llaves compuestas
      //c = caso / a = alerta / e = evento
      //c1a5 -> 3 comentarios
      //c1a4 -> 2 comentarios
      //c2a3 -> 3 comentarios
      //c3a4 -> 1 comentario
      //c4a1 -> 2 comentarios
      //c3a5 -> 2 comentarios
      comentarios['c1a5e14'] = [
        {id: 1, autor: 'MPerez', fecha: '2016-06-09', hora: '10:25:36', texto: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.'},
        {id: 2, autor: 'JRock', fecha: '2016-06-09', hora: '10:25:37', texto: 'Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500.'},
        {id: 3, autor: 'MPerez', fecha: '2016-06-09', hora: '10:25:38', texto: 'Fue popularizado en los 60s con la creación de las hojas "Letraset".'}
      ];
      comentarios['c1a4e12'] = [
        {id: 1, autor: 'GGGGGG', fecha: '2016-06-09', hora: '10:25:38', texto: 'Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles.'},
        {id: 2, autor: 'FReyes', fecha: '2016-06-09', hora: '10:25:38', texto: 'Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio.'}
      ];
      comentarios['c2a3e6'] = [
        {id: 1, autor: 'TGardel', fecha: '2016-06-09', hora: '10:25:36', texto: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.'},
        {id: 2, autor: 'JRock', fecha: '2016-06-09', hora: '10:25:37', texto: 'Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500.'},
        {id: 3, autor: 'Wilson', fecha: '2016-06-09', hora: '10:25:38', texto: 'Fue popularizado en los 60s con la creación de las hojas "Letraset".'}
      ];
      comentarios['c3a4e5'] = [
        {id: 1, autor: 'GGGGGG', fecha: '2016-06-09', hora: '10:25:36', texto: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.'}
      ];
      comentarios['c4a1e10'] = [
        {id: 1, autor: 'FReyes', fecha: '2016-06-09', hora: '10:25:38', texto: 'Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles.'},
        {id: 2, autor: 'TGardel', fecha: '2016-06-09', hora: '10:25:38', texto: 'Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio.'}
      ];
      comentarios['c3a5e16'] = [
        {id: 1, autor: 'Wilson', fecha: '2016-06-09', hora: '10:25:38', texto: 'Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles.'},
        {id: 2, autor: 'FReyes', fecha: '2016-06-09', hora: '10:25:38', texto: 'Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio.'}
      ];
  
      this.comentar = function(llaveComentario, autor, texto, callback) {
        var comentario = obtenerComentario(llaveComentario);
        if(comentario && comentario.length>0) {
          comentario.push({id:0, autor: autor, fecha: '2016-06-21', hora: '21:30', texto: texto});
        }
        else {
          comentarios[llaveComentario] = [];
          comentarios[llaveComentario].push({id:0, autor: autor, fecha: '2016-06-21', hora: '21:30', texto: texto});
        }
  
        callback({header: {code:0}, body:{}});
      }
  
      this.obtenerLlaveComentarios = function(idCaso, idAlerta, idEvento) {
        return 'c' + idCaso + 'a' + idAlerta + 'e' + idEvento;
      }
  
      this.comentariosCasoAlarmaEvento = function(idCaso, idAlerta, idEvento, callback) {
        var comentarios = obtenerComentario('c' + idCaso + 'a' + idAlerta + 'e' + idEvento);
        if (comentarios) {
          callback({header: {code:0}, body: comentarios});
        }
        else {
          callback({header: {code:1, message: 'Sin comentarios'}});
        }
      };
  
      this.obtenerQtyComentariosCasoAlertaEvento = function (idCaso, idAlerta, idEvento) {
        return obtenerComentario('c' + idCaso + 'a' + idAlerta + 'e' + idEvento).length;
      };
  
      function obtenerComentario(idCompuesto) {
        var comments = comentarios[idCompuesto];
        if(comments) {
          return comments
        }
        return [];
      }
    }
})();