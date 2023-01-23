import ContactInfoEntity from "../entities/contact_info.entity";
import { EntityRepository, Repository } from "typeorm";
import ClientEntity from "../entities/client.entity";
import { HttpException } from "../exceptions/http_exception";

@EntityRepository()
class ContactInfoService extends Repository<ContactInfoEntity> {
  public async createContactInfo (reqBody: any, clientId: number | string) {
    const { email, phone } = reqBody;

    const client = await ClientEntity.findOne(clientId);
    if (!client) throw new HttpException(404, "No client with such ID found");
    
    const contactInfo = ContactInfoEntity.create({
      email,
      phone,
      client
    });
    
    try {
      return await contactInfo.save();
    } catch (err) {
      throw err;
    }
  }
  
  public async getContactInfo (email: string) {
    try {
      return await ContactInfoEntity.findOne(email);
    } catch (err) {
      throw err;
    }
  }
}

export default ContactInfoService;