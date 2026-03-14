import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";

const createToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(
    {
      sub: payload.id,
      email: payload.email,
      role: payload.role
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword
  });

  const token = createToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role
  });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = createToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user });
};
