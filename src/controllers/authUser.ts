import User from "../models/userModel";
import { Request, Response } from 'express';
import { DataResponse, DataTokenResponse, MessageResponse } from "../HttpResponse/DataResponse";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import sendMailOTP from "../services/mailOTP";
import jwt from 'jsonwebtoken';
import Exception from "../HttpResponse/Exception";
import { Op } from "sequelize";
import { validationResult } from 'express-validator';
import { hashPassword, comparePassword } from "../utils/bcryptPassword";
import fs from 'fs/promises';
import { roles } from "../utils/data";

export const register = async (req: Request, res: Response) => {
   const result = validationResult(req);
   if (!result.isEmpty()) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: result.array() });
   }
   const file = req.file;
   const { name, email, password, description, addressWallet, role } = req.body;
   if (!file) {
      return res.status(400).json({ msg: "No files uploaded" });
   }
   if (!name || !email || !password || !addressWallet || !role) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.MISSING_INPUT));
   }
   try {
      const user = await User.findOne({ where: { [Op.and]: [{ email: email }, { role: role }, { verifyOTP: true }] } });
      if (user) {
         await fs.unlink(`./public/users/${file.filename}`);
         return res.status(HttpStatusCode.OK).json(DataResponse(true, MessageResponse.ACCOUNT_EXISTS));
      } else { // Create new user: user create account but user dont verify otp and then user register again new account.
         // => remove user and then create new user
         const existsUser: any = await User.findOne({ where: { [Op.and]: [{ email: email }, { verifyOTP: false }] } });
         if (existsUser) {
            await User.destroy({ where: { id: existsUser.id } });
            const filePath = `./public/users/${existsUser.imageName}`;
            await fs.unlink(filePath);
         }
         const imageURL = `${req.protocol}://${req.get("host")}/users/${file.filename}`;
         const otp = Math.floor(100000 + Math.random() * 900000);
         const instanceUser: any = await User.create({
            name: name,
            email: email,
            password: hashPassword(password),
            imageURL: imageURL,
            imageName: file.filename,
            description: description,
            addressWallet: addressWallet,
            role: role,
            otp: otp
         });
         sendMailOTP(email, otp);
         if (instanceUser.role === roles[roles.Customer]) {
            await User.update({ active: true }, { where: { id: instanceUser.id } });
         }
         return res.status(HttpStatusCode.OK).json(DataResponse(false, 'Vui lòng nhập OTP xác thực đã gửi trong email', instanceUser.role));
      }
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const verifyOTP = async (req: Request, res: Response) => {
   const { email, otp, role } = req.body;
   const user: any = await User.findOne({ where: { [Op.and]: [{ email: email }, { role: role }] } });
   if (!user) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
   } else if (Number.parseInt(user.otp) === Number.parseInt(otp)) {
      await User.update({ verifyOTP: true }, {
         where: { email: email }
      })
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.REGISTER_SUCCESS))
   } else {
      res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.WRONG_OTP));
   }
}

export const login = async (req: Request, res: Response) => {
   const { email, password, role } = req.body;
   if (!email || !password) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.MISSING_INPUT));
   try {
      // get user with email and has been verify OTP
      const user: any = await User.findOne({ where: { [Op.and]: [{ email: email }, { verifyOTP: true }, { role: role }] } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      // check password
      const isCorrectPassword = comparePassword(password.toString(), user.password);
      if (!isCorrectPassword) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.WRONG_PASSWORD));
      // check status of user
      if (user.active) {
         const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY || '', { expiresIn: process.env.TOKEN_LIFE });
         const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY || '', { expiresIn: process.env.REFRESH_TOKEN_LIFE });
         return res.status(HttpStatusCode.OK).json(DataTokenResponse(false, MessageResponse.LOGIN_SUCCESS, token, refreshToken));
      } else {
         return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.REVIEWED_ACCOUNT));
      }
   } catch (error: any) {
      throw new Exception(error.message);
   }
}