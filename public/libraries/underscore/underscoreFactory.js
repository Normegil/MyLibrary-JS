'use strict';
angular
  .module('mylibrary')
  .factory('_', function underscoreFactory() {
    return window._;
  });
