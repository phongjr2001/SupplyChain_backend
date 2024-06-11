import express from 'express';
import * as categoryController from '../controllers/categoryController';
import isFarmer from '../authentication/isFarmer';

const router = express.Router();
router.post('/create', isFarmer, categoryController.createCategory);
router.get('/get', isFarmer, categoryController.getCategories);
router.patch('/update/:code', isFarmer, categoryController.updateCategory);
router.delete('/delete/:code', isFarmer, categoryController.deleteCategory);

export default router;