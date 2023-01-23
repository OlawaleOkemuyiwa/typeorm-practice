import { Route } from "./interfaces/route.interface";
import express from "express";
import { createConnection } from "typeorm";
import dbConnection from "../ormconfig";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public app: express.Application;
  private port: number | string;

  constructor (routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 8081;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private async connectToDatabase() {
    try {
      const connection = await createConnection(dbConnection);
      console.log("Successfully connected to DB");
      // const recentMigrations = await connection.runMigrations()
      // console.log(recentMigrations); 
    } catch (err) {
      console.log(err.message);
    }
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use(route.router);
    })
  }

  private initializeErrorHandling() {
    this.app.use((_, res) => {
      res.status(404).json({message: 'Invalid URL or Wrong http request to a valid URL. Please check your url and try again'});
    });

    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port: ${this.port}`);
    })
  }
}

export default App;