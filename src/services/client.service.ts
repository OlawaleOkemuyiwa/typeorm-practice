import ClientEntity from "../entities/client.entity";
import { EntityRepository, Repository } from "typeorm";
import { HttpException } from "../exceptions/http_exception";
import ContactInfoEntity from "../entities/contact_info.entity";

@EntityRepository()
class ClientService extends Repository<ClientEntity> {
  public async createClient (reqBody: any) {
    const {firstName, lastName, cardNumber, pin, balance, phone, email, isActive, additionalInfo, familyMembers} = reqBody;

    const client = ClientEntity.create({
      first_name: firstName,
      last_name: lastName,
      card_number: cardNumber,
      pin,
      balance,
      is_active: isActive,
      additional_info: additionalInfo,
      family_members: familyMembers
    });

    try {
      const savedClient = await client.save();
      const contactInfo = ContactInfoEntity.create({
        email,
        phone,
        client: savedClient
      });
      await contactInfo.save();
      //v2: send welcome mail here
      return savedClient;
    } catch (err) {
      throw err;
    }
  }
  
  public async getClient (clientId: number | string) {
    try {
      const client = await ClientEntity.findOne();
      // to select just few fields/columns from a record/entity
      // const client = await ClientEntity.createQueryBuilder('client')
      //   .select(['client.first_name', 'client.balance'])
      //   .where('client.id = :id', {id: clientId})
      //   .getOne();
      return client;
    } catch (err) {
      throw err;
    }
  }

  public async getClientRelations (clientId: number | string) {
    try {
      return await ClientEntity.findOne(clientId, {relations: ['contact_info', 'transactions', 'bankers']});
    } catch (err) {
      throw err;
    }
  }

  public async getClients () {
    try {
      const clients = await ClientEntity.find({});
      return clients.map(client => client.serializer());
    } catch(err) {
      throw err;
    }
  }

  public async updateClient(clientId: number | string, reqBody: any): Promise<any> {
    // const newLastName: string = 'Okemuyiwa';
    // try {
    //   return await ClientEntity.createQueryBuilder('client')
    //     .update()
    //     .set({balance: () => 'balance + 500'})
    //     .where('client.id = :clientId', { clientId })
    //     .execute();
    // } catch (err) {
    //   throw err;
    // }

    try {
      const client = await ClientEntity.findOne(clientId);
      if(!client) throw new HttpException(404, "No client with such ID found");

      const updatableFields: string[] = ['first_name', 'last_name', 'pin', 'username', 'card_number', 'additional_info', 'family_members'];
      const updatePayload: {} = reqBody;
      const fieldsToBeUpdated: string[] = Object.keys(updatePayload);
      
      const updateIsValid: boolean = fieldsToBeUpdated.every(fieldToBeUpdated => updatableFields.includes(fieldToBeUpdated));

      if (!updateIsValid) throw new HttpException(400, 'Invalid update payload');

      Object.assign(client, updatePayload);

      const updatedClient = await client.save();

      return updatedClient?.serializer();

      //await ClientEntity.update(clientId, {...updatePayload});
      //this method also works in updating but won't trigger the event listeners (e.g @BeforeUpdate) set up to hash an updated pin value
    } catch (error) {
      throw error;
    }
  }
}

export default ClientService;