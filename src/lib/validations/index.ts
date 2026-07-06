import { z } from "zod"

// Product schemas
export const createProductSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Name is required"),
    brand: z.string().optional(),
    size: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    costPrice: z.number().positive("Cost price must be positive"),
    stock: z.number().int().min(0).default(0),
    minStock: z.number().int().min(0).default(0),
    category: z.string().optional(),
    imageUrl: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial()

// Stock schemas
export const stockInSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive("Quantity must be positive"),
    reason: z.string().optional(),
})

export const stockOutSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive("Quantity must be positive"),
    reason: z.string().optional(),
})

// POS schemas
export const posItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
})

export const createPOSTransactionSchema = z.object({
    items: z.array(posItemSchema).min(1, "At least one item is required"),
    paymentMethod: z.enum(["CASH", "QRIS", "DEBIT", "CREDIT"]),
    transactionDate: z.string().optional(),
})

// EOQ schemas
export const calculateEOQSchema = z.object({
    productId: z.string().uuid(),
    annualDemand: z.number().int().positive("Monthly demand must be positive"),
    setupCost: z.number().positive("Setup cost must be positive"),
    holdingCost: z.number().positive("Holding cost must be positive"),
})

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "CASHIER"]).default("CASHIER"),
})
