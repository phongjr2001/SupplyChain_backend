import { DataResponse, MessageResponse } from "../HttpResponse/DataResponse";
import Exception from "../HttpResponse/Exception";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import User from "../models/userModel";
import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response) => {
   const { id } = req.user;
   try {
      const response = await User.findOne(
         {
            where: { id },
            attributes: { include: ['code', 'name', 'email', 'imageName', 'imageURL', 'description', 'addressWallet', 'role'] }
         });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}