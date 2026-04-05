import "dotenv/config"; 
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/task/task.routes";

const app = express();


app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://task-manager-client-rho-nine.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

export default app;