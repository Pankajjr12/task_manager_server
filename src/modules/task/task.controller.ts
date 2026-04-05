import type { Request, Response } from "express";
import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";


export const getTasks = async (req: any, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status;

  const where: any = {
    title: { contains: search, mode: "insensitive" },
  };

  if (status !== undefined) {
    where.completed = status === "true";
  }

  try {
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          completed: true,
          userId: true,
          createdAt: true,
        },
      }),

      prisma.task.count({ where }),
    ]);

    res.json({
      data: tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTaskById = async (req: any, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title)
      return res.status(400).json({ message: "Title is required" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.userId,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (String(task.userId) !== String(req.userId)) {
      return res.status(403).json({
        message: "You are not allowed to modify this task",
      });
    }

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: req.body,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (String(task.userId) !== String(req.userId)) {
      return res.status(403).json({
        message: "You are not allowed to delete this task",
      });
    }

    await prisma.task.delete({
      where: { id: task.id },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleTask = async (req: any, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (String(task.userId) !== String(req.userId)) {
      return res.status(403).json({
        message: "You are not allowed to update this task",
      });
    }

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: { completed: !task.completed },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};