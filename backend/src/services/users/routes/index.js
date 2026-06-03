import { Router } from "express";
import { getUserById, deleteUserById } from "../controller/user-controller.js";

const router = Router();

router.get("/:id", getUserById);

// untuk test postman aja
router.delete("/:id", deleteUserById);

export default router;
