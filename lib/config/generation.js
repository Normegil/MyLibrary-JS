module.exports = {
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
	books: {
		size: process.env.GENERATOR_MANGA_NUMBER || 1,
		enabled: process.env.GENERATOR_MANGA_ENABLED || false
	}
}
