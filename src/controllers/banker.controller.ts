import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import BankerEntity from "../entities/banker.entity";
import { HttpException } from "../exceptions/http_exception";
import BankerService from "../services/banker.service";

class BankerController {
  public BankerService = new BankerService();

  public createBanker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (Object.keys(req.body).length === 0 || !req.params.supervisorId) 
        throw new HttpException(400, 'please include appropriate request body and params');
      const banker = await this.BankerService.createBanker(req.body, req.params.supervisorId);
      res.status(201).json({message: 'banker created sucessfully', banker: banker.serializer()});
    } catch (error) {
      next(error);
    }
  }

  public loginBanker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (Object.keys(req.body).length === 0) throw new HttpException(400, 'please include appropriate request body');
      const {email, password} = req.body;
      if (!email || !password) throw new HttpException(400, 'please include both email and password of banker');
      const { token, banker } = await this.BankerService.loginBanker(email, password);
      res.json({message: "Banker successfully logged in", banker: banker.serializer(), token});
    } catch (error) {
      next(error);
    }
  }

  public logoutBanker = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const banker = await this.BankerService.logoutBanker(req.token as string, req.banker as BankerEntity);
      res.json({message: "Banker successfully logged out", banker: banker.serializer()});
    } catch (error) {
      next(error);
    }
  }

  public logoutFromAll = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const banker = await this.BankerService.logoutFromAll(req.banker as BankerEntity);
      res.json({message: "Banker successfully logged out from all devices", banker: banker.serializer()});
    } catch (error) {
      next(error);
    }
  }

  public connectBankerClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {bankerId, clientId} = req.params;
      if (!bankerId || !clientId) throw new HttpException(400, "please include both banker and client id");
      const banker = await this.BankerService.connectBankerClient(bankerId, clientId);
      res.json({message: 'banker sucessfully connected to client', banker: banker.serializer()});
    } catch (error) {
      next(error);
    }
  }

  public getBanker = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const banker = req.banker;
      res.json({banker: banker!.serializer()});
    } catch (error) {
      next(error);
    }
  } 

  public getBankerRelations = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bankerRelations = await this.BankerService.getBankerRelations(req.banker as BankerEntity);
      res.json(bankerRelations);
    } catch (error) {
      next(error);
    }
  } 

  public deleteBanker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { bankerId } = req.params;
      if (!bankerId) throw new HttpException(400, 'please include the required id of banker');
      const response = await BankerEntity.delete(bankerId);
      res.json({message: "client successfully deleted", response});
    } catch (error) {
      next(error);
    }
  } 
}

export default BankerController;