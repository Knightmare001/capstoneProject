import { Router } from "express";
import { validate } from "../../../middleware/validate.js";
import { loginAuthenticationPayloadSchema, signupAuthenticationPayloadSchema } from "../validator/schema.js";
import { login, logout, signup } from "../controller/authentication-controller.js";
import { protectRoute } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/login", validate(loginAuthenticationPayloadSchema), login);
router.post("/register", validate(signupAuthenticationPayloadSchema), signup);
router.delete("/logout", protectRoute, logout);

export default router;
