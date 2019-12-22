'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('geolocations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'point',
        allowNull: false,
      },
      latitude: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.REAL,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('geolocations');
  },
};
