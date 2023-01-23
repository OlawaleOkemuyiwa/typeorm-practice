import { Router } from "express";
import BankerController from "../controllers/banker.controller";
import { bankerAuth, adminAuth } from "../middlewares/auth.middleware";
import { Route } from "../interfaces/route.interface";

class BankerRoute implements Route {
  public path: string = '/api/bankers';
  public router: Router = Router();
  private BankerController: BankerController = new BankerController();

  constructor() {
    this.router.post(`${this.path}/signup/:supervisorId`, this.BankerController.createBanker);
    this.router.post(`${this.path}/login`, this.BankerController.loginBanker);
    this.router.post(`${this.path}/logout`, bankerAuth, this.BankerController.logoutBanker);
    this.router.post(`${this.path}/logoutAll`, bankerAuth, this.BankerController.logoutFromAll);
    this.router.patch(`${this.path}/:bankerId/clients/:clientId`, adminAuth, this.BankerController.connectBankerClient);
    this.router.get(`${this.path}/me`, bankerAuth, this.BankerController.getBanker);
    this.router.get(`${this.path}/relations/me`, bankerAuth, this.BankerController.getBankerRelations);
    this.router.delete(`${this.path}/:bankerId`, adminAuth, this.BankerController.deleteBanker);
  }
}

export default BankerRoute;