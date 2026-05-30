import { Router } from "express";
import { checkResignReadiness } from "../controller/analysisCareer-controller.js";
import { checkFinancialReadiness } from "../controller/analysisFinancial-controller.js";
import { protectRoute } from "../../../middleware/auth.middleware.js";
import { getCompetencyRecommendation } from "../controller/jobsmarket-controller.js";
import { validate } from "../../../middleware/validate.js";
import {
  AnalysisCareerPayloadSchema,
  AnalysisFinancialPayloadSchema,
  CompetencyPayloadSchema,
} from "../validator/schema.js";

const router = Router();

router.post("/analysis/career", protectRoute, validate(AnalysisCareerPayloadSchema), checkResignReadiness);
router.post("/analysis/financial", protectRoute, validate(AnalysisFinancialPayloadSchema), checkFinancialReadiness);
router.post("/analysis/competency", protectRoute, validate(CompetencyPayloadSchema), getCompetencyRecommendation);

export default router;
