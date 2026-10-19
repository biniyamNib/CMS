'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Update invalid or null Details to {}
      await queryInterface.sequelize.query(
        `UPDATE "OrgStructureApprovals" SET "Details" = '{}' WHERE "Details" IS NULL OR "Details" = '' OR "Details" NOT LIKE '{%'`,
        { transaction }
      );

      // Step 2: Convert stringified JSON to JSON
      await queryInterface.sequelize.query(
        `UPDATE "OrgStructureApprovals" SET "Details" = CAST("Details" AS JSON) WHERE "Details" LIKE '{%'`,
        { transaction }
      );

      // Step 3: Alter column to JSON (JSONB for PostgreSQL)
      const dialect = queryInterface.sequelize.options.dialect;
      const jsonType = dialect === 'postgres' ? Sequelize.JSONB : Sequelize.JSON;
      await queryInterface.changeColumn('OrgStructureApprovals', 'Details', {
        type: jsonType,
        allowNull: false,
        defaultValue: {},
      }, { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Revert to TEXT and convert JSON to string
      await queryInterface.sequelize.query(
        `UPDATE "OrgStructureApprovals" SET "Details" = CAST("Details" AS TEXT)`,
        { transaction }
      );

      await queryInterface.changeColumn('OrgStructureApprovals', 'Details', {
        type: Sequelize.TEXT,
        allowNull: true,
      }, { transaction });
    });
  }
};