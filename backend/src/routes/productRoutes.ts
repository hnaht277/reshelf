import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('SELLER', 'ADMIN'),
  upload.array('images', 5),
  createProduct
);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
