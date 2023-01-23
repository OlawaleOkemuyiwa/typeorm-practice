import BankerEntity from "../entities/banker.entity";
import ClientEntity from "../entities/client.entity";
import { EntityRepository, Repository } from "typeorm";
import { HttpException } from "../exceptions/http_exception";
import TokenEntity from "../entities/token.entity";
// import { getConnection } from "typeorm";

@EntityRepository()
class BankerService extends Repository<BankerEntity> {

  public async createBanker (reqBody: any, supervisorId: number | string) {
    const {firstName, lastName, password, email, yearlySalary, employeeNumber } = reqBody;
    const supervisor = await BankerEntity.findOne(supervisorId);
    
    if (!supervisor) throw new HttpException(404, "No supervisor with such ID exists");
    //the DB is designed in such a way that when a new banker is added, he/she must have a supervisor which is a banker already exisiting (self referencing table). Therefore to create a banker with no supervisor i.e supervisor_id = null (probably a top executive banker or a new boss with no supervisor), we must insert their record manually into the db assigning a value of null to their supervisor_id

    const banker = BankerEntity.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      yearly_salary: yearlySalary,
      employee_number: employeeNumber,
      supervisor
    });
    
    try {
      return await banker.save();
    } catch (err) {
      throw err;
    }
  }

  public async loginBanker (email: string, password: string) {
    try {
      const banker = await BankerEntity.findByCredentials(email, password);
      const token = await banker.generateAuthToken();
      return {banker, token};
    } catch (err) {
      throw err;
    }
  }

  public async logoutBanker (token: string, banker: BankerEntity) {
    try {
      banker.tokens = banker.tokens.filter(tokenRecord => tokenRecord.jwtToken !== token);
      await TokenEntity.delete({jwtToken: token});
      return await banker.save()
    } catch (err) {
      throw err;
    }
  }

  public async logoutFromAll (banker: BankerEntity) {
    try {
      banker.tokens = [];
      await TokenEntity.delete({banker});
      return await banker.save()
    } catch (err) {
      throw err;
    }
  }

  public async connectBankerClient (bankerId: number | string, clientId: number | string) {
    const banker = await BankerEntity.findOne(bankerId, {relations: ["clients"]});
    if (!banker) throw new HttpException(404, "banker not found");

    const client = await ClientEntity.findOne(clientId);
    if (!client) throw new HttpException(404, "client not found");

    try {
      banker.clients = [...banker.clients, client];
      return await banker.save();
      //In larger databases, loading all relations (like how all client relations for a banker is first loaded here before insertion) could be expensive and unnecessary if all we want to do is add a new client relation to a banker i.e. a new row to the intermediate join table.
      //Method below is more effective
      // return await getConnection()
      // .createQueryBuilder()
      // .relation(BankerEntity, "clients")
      // .of(banker)
      // .add(client);
    } catch (err) {
      throw err;
    }
  }

  public async getBankerRelations (banker: BankerEntity) {
    try {
      const bankerId = banker.id;
      return await BankerEntity.findOne(bankerId, {relations: ['supervisor', 'supervisees', 'clients', 'tokens']});
    } catch (err) {
      throw err;
    }
  }  
}

export default BankerService;