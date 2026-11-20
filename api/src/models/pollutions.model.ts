import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export const POLLUTION_TYPES = [
  "Plastique",
  "Chimique",
  "Dépôt sauvage",
  "Eau",
  "Air",
  "Autre",
] as const;

/** Indice de dangerosité */
export const MAX_DANGER_INDEX = 150;

export interface PollutionAttributes {
  id: number;
  title: string;
  type: string;
  description: string;
  observationDate: string; // "YYYY-MM-DD"
  location: string;
  latitude: number;
  longitude: number;
  dangerIndex: number;
  photoUrl?: string | null;
}

export interface PollutionCreationAttributes extends Optional<
  PollutionAttributes,
  "id" | "photoUrl" | "dangerIndex"
> {}

export interface PollutionInstance
  extends
    Model<PollutionAttributes, PollutionCreationAttributes>,
    PollutionAttributes {}

export type PollutionModel = ModelStatic<PollutionInstance>;

export default function definePollutions(
  sequelize: Sequelize,
  _seq?: typeof Sequelize,
): PollutionModel {
  return sequelize.define<PollutionInstance>(
    "pollution",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING(100), allowNull: false },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [[...POLLUTION_TYPES]] },
      },
      description: { type: DataTypes.TEXT, allowNull: false },
      // DATEONLY est renvoyé en "YYYY-MM-DD"
      observationDate: { type: DataTypes.DATEONLY, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { min: -90, max: 90 },
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { min: -180, max: 180 },
      },
      dangerIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: MAX_DANGER_INDEX },
      },
      photoUrl: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: "pollution", freezeTableName: true, timestamps: false },
  );
}
