/* Servicio encargado de hacer las diversas validaciones en las distintas rutas
    del archivo index.route.js */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('Discussion', Discussion)

	Discussion.$inject = [];
	function Discussion() {
    this.allDiscussion = allDiscussion;
    var data = [
        {
            "fecha": "2015-10-12T20:32:08-07:00",
            "user": "Luis Ramos",
            "messages": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra suscipit eleifend."
        },
        {
            "fecha": "2015-10-12T20:32:08-07:00",
            "user": "Jaime Tobar",
            "messages": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra suscipit eleifend."
        },
        {
            "fecha": "2015-10-12T20:32:08-07:00",
            "user": "Eugenio Contreras",
            "messages": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra suscipit eleifend."
        }]

		function allDiscussion() {
			return data;
		}
	}
})();