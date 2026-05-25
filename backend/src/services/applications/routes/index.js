import { Router } from "express";
import { checkResignReadiness } from "../controller/application-controller.js";
import { protectRoute } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.js";
import { AnalyzeResignPayloadSchema } from "../validator/schema.js";

const router = Router();

router.post("/analyze", protectRoute, validate(AnalyzeResignPayloadSchema), checkResignReadiness);

export default router;
