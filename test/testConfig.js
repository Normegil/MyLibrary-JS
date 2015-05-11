var testConfig = {
	data: {
		generation: {
			administrators: {
				size: process.env.GENERATOR_ADMINISTRATOR_SIZE || 1,
				enabled: process.env.GENERATOR_ADMINISTRATOR_ENABLED || false
			},
			moderators: {
				size: process.env.GENERATOR_MODERATOR_SIZE || 10,
				enabled: process.env.GENERATOR_MODERATOR_ENABLED || false
			},
			users: {
				size: process.env.GENERATOR_USER_SIZE || 100,
				enabled: process.env.GENERATOR_USER_ENABLED || false
			},
			mangas: {
				size: process.env.GENERATOR_MANGA_NUMBER || 1000,
				enabled: process.env.GENERATOR_MANGA_ENABLED || false
			},
			resource: {
				paths: ['/mangas'],
				methods: ['GET', 'POST',	'PUT', 'DELETE']
			}
		}
	}
}

module.exports = testConfig;
