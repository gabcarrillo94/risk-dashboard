/**/

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('Paginator', Paginator)


  Paginator.$inject = [];
  
    function Paginator() {
      var service = {};
  
      service.getPagesWindow = function (total, limit, active) {
        var totalPages = Math.ceil(total/limit);
        if(totalPages <= 10) {
          var res = [];
          for(var i = 0 ; i < totalPages ; i++) {
            res.push(i+1);
          }
          return res;
        }
        else {
          if(active > 6) {
            if(totalPages - active < 4) {
              return [
                totalPages - 9,
                totalPages - 8,
                totalPages - 7,
                totalPages - 6,
                totalPages - 5,
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
              ];
            }
            else {
              return [
                active - 5,
                active - 4,
                active - 3,
                active - 2,
                active - 1,
                active,
                active + 1,
                active + 2,
                active + 3,
                active + 4
              ];
            }
          }
          else {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          }
        }
      };
      return service;
    }
})();