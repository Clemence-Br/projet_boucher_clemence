import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface UserAttributes {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  email: string;
  password: string; // stocké haché, jamais en clair
}

export interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id"
> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export type UserModel = ModelStatic<UserInstance>;

export default function defineUsers(sequelize: Sequelize): UserModel {
  return sequelize.define<UserInstance>(
    "user",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      login: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      nom: { type: DataTypes.STRING, allowNull: false },
      prenom: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: false,
      // Le mot de passe n'est jamais renvoyé par défaut
      defaultScope: { attributes: { exclude: ["password"] } },
    },
  );
}
