'use strict';
angular
  .module('mylibrary')
  .factory('Alerts', function alertsFactory() {
    return {
      list: [],
      add: function addAlert(gType, err) {
        err.type = gType;
        this.list.push(err);
      },
      remove: function removeAlert(index) {
        this.list.splice(index, 1);
      },
    };
  });
