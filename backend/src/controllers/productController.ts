import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../config/cloudinary';

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      reason,
      price,
      originalPrice,
      discountPrice,
      expiryDate,
      stock,
      categoryId,
      imageUrl,
      co2SavingsKg,
    } = req.body;

    let uploadedImageUrl: string | undefined;
    if (req.files && Array.isArray(req.files)) {
      const [file] = req.files;
      if (file) uploadedImageUrl = await uploadToCloudinary(file.buffer);
    }

    const seller = await prisma.seller.findUnique({
      where: { ownerId: req.userId! },
    });

    if (!seller) {
      return res.status(400).json({ message: 'Seller profile is required before creating products' });
    }

    const resolvedImageUrl = uploadedImageUrl || imageUrl;
    if (!resolvedImageUrl) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        reason,
        price: parseInt(price ?? discountPrice, 10),
        originalPrice: parseInt(originalPrice, 10),
        imageUrl: resolvedImageUrl,
        expiryDate: new Date(expiryDate),
        stock: parseInt(stock),
        co2SavingsKg: co2SavingsKg ? parseFloat(co2SavingsKg) : undefined,
        sellerId: seller.id,
        categoryId,
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            rating: true,
            verified: true,
            address: true,
            lat: true,
            lng: true,
          },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoryId,
      category,
      minPrice,
      maxPrice,
      expiresBefore,
      search,
      q,
      sort,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { status: 'ACTIVE' };

    if (categoryId) where.categoryId = categoryId;
    if (category) where.category = { slug: category as string };
    if (expiresBefore) where.expiryDate = { lte: new Date(expiresBefore as string) };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice as string, 10);
      if (maxPrice) where.price.lte = parseInt(maxPrice as string, 10);
    }
    const searchQuery = search || q;
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery as string, mode: 'insensitive' } },
        { description: { contains: searchQuery as string, mode: 'insensitive' } },
      ];
    }

    const orderBy =
      sort === 'expiry'
        ? { expiryDate: 'asc' as const }
        : sort === 'price'
          ? { price: 'asc' as const }
          : { createdAt: 'desc' as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              rating: true,
              verified: true,
              address: true,
              lat: true,
              lng: true,
            },
          },
        },
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      items: products,
      page: Number(page),
      limit: Number(limit),
      total,
      hasMore: skip + products.length < total,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            rating: true,
            verified: true,
            address: true,
            lat: true,
            lng: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productSeller = await prisma.seller.findUnique({
      where: { id: product.sellerId },
      select: { ownerId: true },
    });

    if (productSeller?.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (updates.price) updates.price = parseInt(updates.price, 10);
    if (updates.originalPrice) updates.originalPrice = parseInt(updates.originalPrice, 10);
    if (updates.discountPrice) {
      updates.price = parseInt(updates.discountPrice, 10);
      delete updates.discountPrice;
    }
    if (updates.expiryDate) updates.expiryDate = new Date(updates.expiryDate);
    if (updates.stock) updates.stock = parseInt(updates.stock, 10);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updates,
      include: { category: true, seller: true },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productSeller = await prisma.seller.findUnique({
      where: { id: product.sellerId },
      select: { ownerId: true },
    });

    if (productSeller?.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.product.update({
      where: { id },
      data: { status: 'HIDDEN' },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};
