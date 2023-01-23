import { Router } from "express";
import ClientController from "../controllers/client.controller";
import { Route } from "../interfaces/route.interface";

class ClientRoute implements Route {
  public path: string = '/api/clients';
  public router: Router = Router();
  private clientController: ClientController = new ClientController();

  constructor() {
    this.router.post(`${this.path}`, this.clientController.createClient);
    this.router.get(`${this.path}/:clientId`, this.clientController.getClient);
    this.router.get(`${this.path}/relations/:clientId`, this.clientController.getClientRelations);
    this.router.get(`${this.path}`, this.clientController.getClients);
    this.router.patch(`${this.path}/:clientId`, this.clientController.updateClient);
    this.router.delete(`${this.path}/:clientId`, this.clientController.deleteClient);
  }
}

export default ClientRoute;