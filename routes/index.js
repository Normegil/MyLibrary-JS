var manga = require('./manga');

function setupRoutes(router){
	manga.setup(router);
}

module.exports = setupRoutes;
