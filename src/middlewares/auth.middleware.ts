import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import BankerEntity from "../entities/banker.entity";

interface JwtPayload {
  bankerId: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  token?: string;
  banker?: BankerEntity
}

export const bankerAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.headers){
    res.status(401).send({ message: 'No authorization headers.' });
    return;
  }

  try {
    const tokenBearer = req.header("Authorization");

    const token = tokenBearer?.replace("Bearer ", "");

    if (!token) throw new Error();

    const { bankerId } = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

    const banker = await BankerEntity.findOne(bankerId, { relations: ['tokens'] });
    const tokenIsValid = banker?.tokens.some(tokenRecord => tokenRecord.jwtToken === token);

    if (!banker || !tokenIsValid) throw new Error();

    req.token = token;
    req.banker = banker;

    next();
  } catch (error) {
    res.status(401).send({ message: "Please authenticate." });
  }
};

export const adminAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const customNextFunc = () => {
    if (!req.banker) throw new Error();
    if (req.banker.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden request, Access denied!" });
    }
  };
  bankerAuth(req, res, customNextFunc);
};
