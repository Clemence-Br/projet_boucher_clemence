import { Request, Response } from "express";
import db from "../models";
import { POLLUTION_TYPES } from "../models/pollutions.model";

const Pollutions = db.pollutions;

const getId = (req: Request): number => Number(req.params.id);

/** Ne garde que les champs autorisés (évite d'écraser l'id, par exemple) */
const pickBody = (b: Record<string, unknown>) => ({
  title: b.title,
  type: b.type,
  description: b.description,
  observationDate: b.observationDate,
  location: b.location,
  latitude: b.latitude,
  longitude: b.longitude,
  photoUrl: b.photoUrl || null,
});

/** Validation minimale côté serveur : ne jamais se fier uniquement au front */
const validate = (d: ReturnType<typeof pickBody>): string | null => {
  if (!d.title || !d.description || !d.location || !d.observationDate) {
    return "Titre, description, lieu et date sont requis.";
  }
  if (!POLLUTION_TYPES.includes(d.type as never))
    return "Type de pollution invalide.";
  if (typeof d.latitude !== "number" || d.latitude < -90 || d.latitude > 90)
    return "Latitude invalide.";
  if (
    typeof d.longitude !== "number" ||
    d.longitude < -180 ||
    d.longitude > 180
  )
    return "Longitude invalide.";
  return null;
};

/**
 * Récupère la liste de toutes les mesures de pollution depuis la base PostgreSQL.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]],
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message:
        "Erreur lors de la récupération des données de pollution: " + message,
    });
  }
};

/**
 * Récupère une mesure de pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message:
        `Erreur lors de la récupération de la pollution id=${id}: ` + message,
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const data = pickBody(req.body ?? {});
  const error = validate(data);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    const created = await Pollutions.create(data as never);
    res.status(201).json(created);
  } catch (err: unknown) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  const data = pickBody(req.body ?? {});
  const error = validate(data);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      res.status(404).json({ message: `Aucune pollution avec l'id=${id}.` });
      return;
    }

    await pollution.update(data as never);
    res.status(200).json(pollution); // le front attend l'objet mis à jour
  } catch (err: unknown) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  try {
    const deleted = await Pollutions.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ message: `Aucune pollution avec l'id=${id}.` });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default { getAll, getById, create, update, remove };
