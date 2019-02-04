(function() {
  'use strict';

  angular
      .module('dashboard')
      .filter('moment', moment);

  /** @ngInject */
  function moment(moment) {
     return function(dateString, format) {
        return moment(dateString).format(format);
    };
  }

})();
