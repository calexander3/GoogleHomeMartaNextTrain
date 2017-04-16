import * as express from 'express';

export let router = express.Router();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send('Ok');
});

router.put('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.delete('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.sendStatus(405);
});