import * as express from 'express';
import * as basicAuth from 'basic-auth';
import * as Url from 'url';
import * as https from 'https';
import { Parameters } from "../models/google-home";
import { NextArrivalService } from "../services/next-arrival";

export let router = express.Router();

let nextArrivalService = new NextArrivalService();

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

  let trainRequestParameters: Parameters = req.body.result.parameters;
  nextArrivalService.GetNextArrival(trainRequestParameters.station, trainRequestParameters.destination, trainRequestParameters.direction)
  .then(response => res.send(response))
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  })
 
});