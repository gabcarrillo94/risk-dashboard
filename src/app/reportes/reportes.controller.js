(function () {
    'use strict';

    angular
        .module('dashboard')
        .controller('ReportesController', ReportesController);

    ReportesController.$inject = ['$scope', '$state', 'ReportsFactory'];

    function ReportesController($scope, $state, ReportsFactory) {
    	var vm = this;
    	var report = null;
    	vm.pbi = {};
    	vm.tipoReportes = [{id:"PBI", label:"PowerBi"}];
        
        // -- Obtener los grupos(Workspaces) de PBI
		vm.getGroups = function(){
			return new Promise(function (resolve, reject) {
				// -- Si ya estan cargados los grupos
				if(vm.pbi.groups){ resolve(true); return true; }
				// -- Si no estan cargados los grupos, los carga
				ReportsFactory.getGroups()
					.then(function(res){
						vm.pbi.groups = res.filter(function(elem){ return elem.activo == true; })
						$scope.$apply();
						console.log('GRUPOS CARGADOS');
						resolve(true);
					})
					.catch(function(err){
						console.log("Error al obtener los grupos");
						console.log(err);
						reject(false);
					});
			});
		}

		// -- Obtener los reportes
		vm.getReports = function(){
			return new Promise(function (resolve, reject) {
				ReportsFactory.getReports({ 
					groupId: vm.grupo.workspaceId
				})
					.then(function(res){
						vm.pbi.reports = res;
						$scope.$apply();
						console.log('REPORTES CARGADOS');
						resolve(true);
					})
					.catch(function(err){
						console.log("Error al obtener los grupos");
						console.log(err);
						reject(false);
					});
			});
		}

		// -- Obtener el token de acceso al reporte seleccionado
		vm.getReport = function(){
			ReportsFactory.getReportToken({ 
				groupId: vm.grupo.workspaceId,
				reportId: vm.reporte.id
			}).then(function(res){
				vm.reporte.token = res.token;
				vm.reporte.expiration = new Date(res.expiration);
				renderReport();
			});
		}

		// -- Embebido del reporte de PBI
		var renderReport = function(){
			var models = window['powerbi-client'].models;
	        // -- Insertar reporte	        
	        var config = {
	            type: 'report', // 'dashboard'
	            tokenType: models.TokenType.Embed,
	            accessToken: vm.reporte.token,
	            embedUrl: vm.reporte.embedUrl,
	            id: vm.reporte.id,
	            settings: {
	                filterPaneEnabled: true,
	                navContentPaneEnabled: true
	            }
	        };
	        
	        var $reportContainer = $('#reportContainer');
	        report = powerbi.embed($reportContainer.get(0), config);
	        report.off("loaded");
	        report.on('loaded', OnloadedReport);
	        report.on('error', OnErrorReport);
		}

		var OnloadedReport = function(c) {
        	setTokenExpirationListener(vm.reporte.expiration, 5, vm.reporte.id, vm.grupo.workspaceId);
        	return false;
        	//get available pages to attach to navigation tree
			/*report.getPages()
		  		.then(function(pages){
		    		pages.forEach(function(page) {
			      		$scope.$apply(function() {
			        		//populate the nav-tree
			        		console.log(ReportsFactory.getPages(page)); // console.log(new ReportsFactory.Leaf(page)); // new was used by Services nor Factories
			       		 	//$scope.tree[0].pages.push(new ReportsFactory.Leaf(page));
			      		});
		    		});
		  		})
			  	.catch(function(err){
			    	console.log(err);
			  	});*/
		}

		var OnErrorReport = function(e) {
			console.log(e);
			report.off("error");
		}

		var setTokenExpirationListener = function(tokenExpiration,  minutesToRefresh, reportId, groupId) {
		    // get current time
		    var currentTime = Date.now();
		    var expiration = Date.parse(tokenExpiration);
		    var safetyInterval = minutesToRefresh* 60 * 1000;

		    // time until token refresh in milliseconds
		    var timeout = expiration - currentTime - safetyInterval;

		    // if token already expired, generate new token and set the access token
		    if (timeout<=0)
		    {
		        console.log("Updating Report Embed Token");
		        updateToken(reportId, groupId);
		    }
		    // set timeout so minutesToRefresh minutes before token expires, token will be updated
		    else 
		    {
		        console.log("Report Embed Token will be updated in " + timeout + " milliseconds.");
		        setTimeout(function() {
		        	console.log("Updating Report Embed Token");
		        	updateToken(reportId, groupId);
		        }, timeout);
		    }
		}

		function updateToken(reportId, groupId) {
		    // Generate new EmbedToken
		    ReportsFactory.getReportToken({ 
				groupId: groupId,
				reportId: reportId
			}).then(function(res){
				report.setAccessToken(res.token)
		        .then(function() {
		        	console.log("Token Actualizado")
		        	setTokenExpirationListener(new Date(res.expiration), 5, reportId, groupId);
		        });
			});
		}
    }
})();