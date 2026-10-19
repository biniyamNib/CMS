'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('audit_log', 'Details', 'Changes');
    await queryInterface.changeColumn('audit_log', 'Changes', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('audit_log', 'Changes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.renameColumn('audit_log', 'Changes', 'Details');
  }
};