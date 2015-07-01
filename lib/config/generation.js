'use strict';

module.exports = {
  groups: [
    {
      name: 'administrator',
      size: process.env.GENERATOR_ADMINISTRATOR_SIZE || 1,
      enabled: process.env.GENERATOR_ADMINISTRATOR_ENABLED || false,
      hasAccess: function hasAccess() {
        return true;
      },
    },
    {
      name: 'moderator',
      size: process.env.GENERATOR_MODERATOR_SIZE || 10,
      enabled: process.env.GENERATOR_MODERATOR_ENABLED || false,
      hasAccess: function hasAccess(path, method) {
        return 'DELETE' !== method;
      },
    },
    {
      name: 'users',
      size: process.env.GENERATOR_USER_SIZE || 100,
      enabled: process.env.GENERATOR_USER_ENABLED || false,
      hasAccess: function hasAccess(path, method) {
        return 'GET' === method;
      },
    },
  ],
  bookserie: {
    size: process.env.GENERATOR_MANGA_NUMBER || 1,
    enabled: process.env.GENERATOR_MANGA_ENABLED || false,
  },
};
