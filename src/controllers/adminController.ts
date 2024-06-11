import { Request, Response } from "express";
import User from "../models/userModel";
import { roles } from "../utils/data";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import { DataResponse, MessageResponse } from "../HttpResponse/DataResponse";
import Exception from "../HttpResponse/Exception";

export const addUser = async (req: Request, res: Response) => {
   const { role } = req.user;
   const id = req.params.id;
   if (role !== roles[roles.admin]) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.NOT_ADMIN));
   }
   try {
      await User.update({ active: true }, { where: { id } });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.APPROVE_ACCOUNT_SUCCESS));
   } catch (error: any) {
      throw new Exception(error.message)
   }
}