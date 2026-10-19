import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Company = sequelize.define(
  "Company",
  {
    CompanyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ParentCompanyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Companies",
        key: "CompanyId",
      },
    },
    CompanyName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: { is: /^\+?[\d\s-]{6,20}$|^$/ },
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: { isEmail: true },
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    TopPosition: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    EstablishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    TinNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    Logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Logo: {
    //   type: DataTypes.BLOB("long"),
    //   allowNull: true,
    // },
    RegistrationNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    NoOfShareholders: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    RegisteredCapital: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    SubscribedCapital: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    RegisteredShareQt: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    SubscribedShareQt: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    ShareValue: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
  },
  {
    timestamps: true,
    tableName: "Companies",
  }
);

export default Company;
