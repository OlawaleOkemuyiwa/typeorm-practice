import { NextFunction, Request, Response } from "express";
import ClientEntity from "../entities/client.entity";
import { HttpException } from "../exceptions/http_exception";
import ClientService from "../services/client.service";

class ClientController {
  public ClientService = new ClientService();

  public createClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (Object.keys(req.body).length === 0) throw new HttpException(400, 'please include appropriate request body');
      const client = await this.ClientService.createClient(req.body);
      res.status(201).json({message: 'client created sucessfully', client: client.serializer()});
    } catch (error) {
      next(error);
    }
  }

  public getClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      if (!clientId) throw new HttpException(400, 'please include the required id of client');
      const client = await this.ClientService.getClient(clientId);
      if (!client) throw new HttpException(404, "No client with such ID found");
      res.json({ client: client.serializer() });
    } catch (error) {
      next(error);
    }
  }

  public getClientRelations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      if (!clientId) throw new HttpException(400, 'please include the required id of client');
      const client = await this.ClientService.getClientRelations(clientId);
      if (!client) throw new HttpException(404, "No client with such ID found");
      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  public getClients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await this.ClientService.getClients();
      if (clients.length === 0) throw new HttpException(404, "No client found");
      res.json(clients);
    } catch (error) {
      next(error);
    }
  }

  public deleteClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      if (!clientId) throw new HttpException(400, 'please include the required id of client');
      const response = await ClientEntity.delete(clientId);
      //v2: send account closure email
      res.json({message: "client successfully deleted", response});
    } catch (error) {
      next(error);
    }
  }

  public updateClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      if (!clientId || Object.keys(req.body).length === 0) throw new HttpException(400, 'please include the required id of client and request body');
      const updatedClient = await this.ClientService.updateClient(clientId, req.body);
      res.json({message: "client successfully updated", client: updatedClient});
    } catch (error) {
      next(error);
    }
  }
}

export default ClientController;