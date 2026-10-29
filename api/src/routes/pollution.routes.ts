import { Application, Router } from "express";
import pollutionController from "../controllers/pollution.controllers";

export default (app: Application): void => {
  const router = Router();

  router.get("/", pollutionController.getAll);
  router.get("/:id", pollutionController.getById);
  router.post("/", pollutionController.create);
  router.put("/:id", pollutionController.update);
  router.delete("/:id", pollutionController.remove);

  app.use("/api/pollutions", router);
};
