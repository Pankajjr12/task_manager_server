import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskById
} from "../task/task.controller";

const router = Router();

router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.patch("/:id/toggle", authMiddleware, toggleTask);
export default router;