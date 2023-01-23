import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http_exception";
import ContactInfoService from "../services/contact_info.service";

class ContactInfoController {
  public ContactInfoService = new ContactInfoService();

  public createContactInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      if (Object.keys(req.body).length === 0 || !req.params.clientId) 
        throw new HttpException(400, 'please include appropriate request body and params');
      const contactInfo = await this.ContactInfoService.createContactInfo(req.body, clientId);
      res.status(201).json({message: 'contactInfo created sucessfully', contactInfo});
    } catch (error) {
      next(error);
    }
  }

  public getContactInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.params;
      if (!email) throw new HttpException(400, 'please include the appropriate request params');
      const contactInfo = await this.ContactInfoService.getContactInfo(email);
      if (!contactInfo) throw new HttpException(404, "No contactInfo with such email");
      res.json(contactInfo);
    } catch (error) {
      next(error);
    }
    
  } 
}

export default ContactInfoController;