import { Router } from "express";
import authentication from "../services/authentications/routes/index.js";
import user from "../services/users/routes/index.js";

const router = Router();

router.use("/user", user);
router.use("/api/auth", authentication);

export default router;
