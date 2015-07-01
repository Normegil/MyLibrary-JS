'use strict';
angular
  .module('mylibrary')
  .factory('moment', function momentFactory() {
    return window.moment;
  });
