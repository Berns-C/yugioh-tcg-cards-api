import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utilities/error';

export const findOneByString =
  (fn, model, keyName) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const obj = {};
    obj[keyName] = req.params.name.toUpperCase();
    const data = await model.findOne(obj);

    if (data) {
      fn(req, res, next, data);
    } else {
      next(
        new ErrorResponse(`No data with name ${obj[keyName]} was found.`, 404)
      );
    }
  };
