import * as express from 'express';
import * as basicAuth from 'basic-auth';
import * as Url from 'url';
import * as https from 'https';
import { Parameters, GoogleHomeRequest } from "../models/google-home";
import { NextArrivalService } from "../services/next-arrival";
import { RiderAlertService } from "../services/rider-alert";

export class RequestHandler {
  public router = express.Router();

  private nextArrivalService = new NextArrivalService();
  private alertService = new RiderAlertService();

  constructor() {
    this.router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.sendStatus(405);
    });

    this.router.put('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.sendStatus(405);
    });

    this.router.delete('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.sendStatus(405);
    });

    this.router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if(!req.headers.authorization){
        res.sendStatus(401);
        return;
      }
      const credentials = basicAuth(req);
      if(credentials.name !== process.env.BASICUSER || credentials.pass !== process.env.BASICPASS){
        res.sendStatus(401);
        return;
      }
      
      let request: GoogleHomeRequest = req.body;

      if (typeof(this[`handle${request.result.action}Request`]) === 'function') {
        this[`handle${request.result.action}Request`](request, res);
      }
      else {
        console.error(`No handler for action ${request.result.action}`);
        res.sendStatus(400);
      }
    });
  }
  
  private handleNextTrainRequest(request: GoogleHomeRequest, res: express.Response) {
    let trainRequestParameters = request.result.parameters;
    this.nextArrivalService.GetNextArrival(trainRequestParameters.station,
                                      trainRequestParameters.destination,
                                      trainRequestParameters.direction,
                                      trainRequestParameters.line)
    .then(response => res.send(response))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
  }

  private handleAlertsRequest(request: GoogleHomeRequest, res: express.Response) {
    this.alertService.GetActiveAlerts()
      .then(response => res.send(response))
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  }
}

