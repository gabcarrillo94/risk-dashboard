angular
.module('dashboard')
.factory('CaseCommentsFactory', CaseCommentsFactory)

CaseCommentsFactory.$inject = ['$localStorage'];

function CaseCommentsFactory($localStorage) {
    return {
    	result: false
        // socket: io('/wsCasos')
    }
}
