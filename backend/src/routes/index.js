import { Router } from "express";
import authentication from "../services/authentications/routes/index.js";
import user from "../services/users/routes/index.js";
import application from "../services/applications/routes/index.js";
import history from "../services/histories/routes/index.js";

const router = Router();

router.use("/api/user", user);
router.use("/api/auth", authentication);
router.use("/api/application", application);
router.use("/api/histories", history);

export default router;
