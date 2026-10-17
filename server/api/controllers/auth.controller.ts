import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db.ts';

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password cannot exceed 72 characters")
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ status: "error", message: validation.error.issues[0]?.message || "Invalid input data" });
      return;
    }
    
    const { email, password } = validation.data;
    
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ status: "error", message: "Account with this email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await db.user.create({ 
      data: { email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true } 
    });
    
    res.status(201).json({ status: "success", message: "User registered securely", data: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(255),
  password: z.string().min(1, "Password is required").max(72, "Invalid password length")
});

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ status: "error", message: validation.error.issues[0]?.message || "Invalid input" });
      return;
    }
    
    const { email, password } = validation.data;
    const user = await db.user.findUnique({ where: { email } });
    
    if (!user) {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
      return;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET missing in .env");
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret, 
      { expiresIn: '1d', algorithm: 'HS256' }
    );
    
    res.status(200).json({ status: "success", message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};