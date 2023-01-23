import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/http_exception';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 400;
    const message: string = error.message || 'Something went wrong';

    //CCC: Make passing status code optional

    res.status(status).json({ message});
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
