import express, { Router } from 'express';
import * as authUser from '../controllers/authUser';
import path from 'path';
import multer from 'multer';
import { body } from 'express-validator';
import * as userController from '../controllers/userController';

const router: Router = express.Router();

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      // Xác định nơi lưu trữ tệp tin tải lên
      cb(null, './public/users/');
   },
   filename: function (req, file, cb) {
      // Tạo tên tệp tin mới cho tệp tin tải lên
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
      cb(null, file.fieldname + '-' + uniqueSuffix);
   }
});

const upload = multer({ storage: storage });

router.post('/register', upload.single('image'), body('email').isEmail(), body('password').isLength({ min: 6 }), authUser.register);
router.post('/verifyOTP', authUser.verifyOTP);
router.post('/login', authUser.login);
router.get('/getMe', userController.getMe);

export default router;