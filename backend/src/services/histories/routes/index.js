import { Router } from "express";
import { getUserHistories, savePredictionHistory } from "../controller/history-controller.js";
import { protectRoute } from "../../../middleware/auth.middleware.js";
import { SaveHistoryPayloadSchema } from "../validator/schema.js";
import { validate } from "../../../middleware/validate.js";

const router = Router();

router.get("/", protectRoute, getUserHistories);

router.post("/", protectRoute, validate(SaveHistoryPayloadSchema), savePredictionHistory);

export default router;
