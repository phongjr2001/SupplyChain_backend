import express from 'express';
import * as adminController from '../controllers/adminController';

const router = express.Router();

router.patch('/approve/:id', adminController.addUser);

export default router;