'use strict';

angular
  .module('mylibrary')
  .directive('onEnter', function onEnterController() {
    return function bindToElement(scope, element, attrs) {
      element.bind('keypress', function onKeyPress(event) {
        var enterKeyPressNumber = 13;
        if (enterKeyPressNumber === event.which) {
          scope.$apply(function triggerAction() {
            scope.$eval(attrs.onEnter, {event: event});
          });
        }
      });
    };
  });
