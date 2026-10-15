import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../prisma/db.ts';
import { AuthRequest } from '../middlewares/auth.middleware.ts';

const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required").max(150),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative")
});

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: "success", data: products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ status: "error", message: validation.error.issues[0]?.message || "Invalid input" });
      return;
    }

    const product = await db.product.create({
      data: validation.data
    });

    res.status(201).json({ status: "success", data: product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const orderSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be at least 1")
});

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = orderSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ status: "error", message: validation.error.issues[0]?.message || "Invalid input" });
      return;
    }

    const { productId, quantity } = validation.data;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const order = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product || product.stock < quantity) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      await tx.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantity }
      });

      return tx.order.create({
        data: {
          userId,
          productId,
          quantity,
          total: product.price * quantity
        }
      });
    });

    res.status(201).json({ status: "success", data: order });
  } catch (error: any) {
    if (error.message === "INSUFFICIENT_STOCK") {
      res.status(400).json({ status: "error", message: "Product not found or insufficient stock" });
      return;
    }
    console.error("Create order error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await db.order.findMany({
      where: { userId: req.user?.id },
      include: { product: { select: { id: true, name: true, price: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: "success", data: orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};