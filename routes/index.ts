import * as express from 'express';
import * as basicAuth from 'basic-auth';
import * as Url from 'url';
import { GoogleHomeRequest, Fulfillment } from "../models/google-home";
import { ApiRequestService } from "../services/api-request";
import * as https from 'https';

export let router = express.Router();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.put('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.delete('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if(!req.headers.authorization){
    res.sendStatus(401);
    return;
  }
  const credentials = basicAuth(req);
  if(credentials.name !== process.env.BASICUSER || credentials.pass !== process.env.BASICPASS){
    res.sendStatus(401);
    return;
  }

 
});