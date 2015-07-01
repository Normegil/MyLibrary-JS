'use strict';
global.__root = __dirname;
global.requireModule = function requireModule(name) {
  return require(__dirname + '/lib/' + name);
};
var app = requireModule('app');
var config = requireModule('config');

app.launch(config.port);
