import * as dotenv from "dotenv";
dotenv.config();

import App from "./app";
import BankerRoute from "./routes/banker.route";
import ClientRoute from "./routes/client.route";
import ContactInfoRoute from "./routes/contact_info.route";
import TransactionRoute from "./routes/transaction.route";

const app = new App([
  new ClientRoute(),
  new BankerRoute(),
  new TransactionRoute(),
  new ContactInfoRoute()
]);

app.listen();