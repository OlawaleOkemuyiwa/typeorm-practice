import { Router } from "express";
import ContactInfoController from "../controllers/contact_info.controller";
import { Route } from "../interfaces/route.interface";

class ContactInfoRoute implements Route {
  public path: string = '/api/contact-info';
  public router: Router = Router();
  private ContactInfoController: ContactInfoController = new ContactInfoController();

  constructor() {
    this.router.post(`${this.path}/:clientId`, this.ContactInfoController.createContactInfo);
    this.router.get(`${this.path}/:email`, this.ContactInfoController.getContactInfo);
  }
}

export default ContactInfoRoute;