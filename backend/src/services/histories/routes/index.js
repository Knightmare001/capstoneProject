import { Router } from "express";
import { getUserHistoriesCareer, saveCareerHistory } from "../controller/history-career-controller.js";
import { getUserHistoriesFinancial, saveFinancialHistory } from "../controller/history-financial-controller.js";
import { protectRoute } from "../../../middleware/auth.middleware.js";
import { SaveHistoryCareerPayloadSchema, SaveHistoryFinancialPayloadSchema } from "../validator/schema.js";
import { validate } from "../../../middleware/validate.js";

const router = Router();

router.get("/career", protectRoute, getUserHistoriesCareer);
router.post("/career", protectRoute, validate(SaveHistoryCareerPayloadSchema), saveCareerHistory);

router.get("/financial", protectRoute, getUserHistoriesFinancial);
router.post("/financial", protectRoute, validate(SaveHistoryFinancialPayloadSchema), saveFinancialHistory);

export default router;
