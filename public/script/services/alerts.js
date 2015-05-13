'use strict';
angular
	.module('mylibrary')
	.factory('Alerts', function() {
		return {
			list: [],
			add: function(gType, err){
				err.type= gType;
				this.list.push(err);
			},
			remove: function(index){
				this.list.splice(index, 1);
			}
		}
	});
