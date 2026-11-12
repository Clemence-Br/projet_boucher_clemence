import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UniqueConstraintError } from "sequelize";
import db from "../models";

const Users = db.users;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** GET /api/users */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.findAll({ order: [["id", "ASC"]] }); // sans password (defaultScope)
    res.status(200).json(users);
  } catch (err: unknown) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

/** POST /api/users */
export const create = async (req: Request, res: Response): Promise<void> => {
  const { login, nom, prenom, email, password } = req.body ?? {};

  // Validation
  if (
    ![login, nom, prenom, email, password].every(
      (v) => typeof v === "string" && v.trim(),
    )
  ) {
    res.status(400).json({
      message: "Login, nom, prénom, email et mot de passe sont requis.",
    });
    return;
  }
  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ message: "Le format de l'email est invalide." });
    return;
  }

  try {
    const exists = await Users.findOne({ where: { login: login.trim() } });
    const emailTaken = await Users.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (exists || emailTaken) {
      res
        .status(409)
        .json({ message: "Ce login ou cet email est déjà utilisé." });
      return;
    }

    const created = await Users.create({
      login: login.trim(),
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json({
      id: created.id,
      login: created.login,
      nom: created.nom,
      prenom: created.prenom,
      email: created.email,
    });
  } catch (err: unknown) {
    // Filet de sécurité en cas de requêtes simultanées
    if (err instanceof UniqueConstraintError) {
      res
        .status(409)
        .json({ message: "Ce login ou cet email est déjà utilisé." });
      return;
    }
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'utilisateur." });
  }
};

/** POST /api/users/login : connexion fictive, sans jeton */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { login, password } = req.body ?? {};
  if (
    typeof login !== "string" ||
    typeof password !== "string" ||
    !login.trim() ||
    !password
  ) {
    res.status(400).json({ message: "Login et mot de passe requis." });
    return;
  }

  try {
    // unscoped() : permet de récupérer le password, normalement exclu par le defaultScope
    const user = await Users.unscoped().findOne({
      where: { login: login.trim() },
    });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!user || !ok) {
      res.status(401).json({ message: "Login ou mot de passe incorrect." });
      return;
    }
    res.status(200).json({
      id: user.id,
      login: user.login,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
    });
  } catch {
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};

export default { getAll, create, login };
