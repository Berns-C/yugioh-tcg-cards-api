import { Types } from 'mongoose';
import { ErrorResponse, getErrorMessage } from '../utilities/error';
import { SCHEMA_ERROR_KEYS } from '../data/constant_variables';

export const validateAndFindID = (fn, model) => async (req, res, next) => {
  let isError = false;
  let status = null;
  let message = '';
  const requestID = req.params.id;
  if (Types.ObjectId.isValid(requestID)) {
    const result = await model.findById({ _id: req.params.id });
    if (result) {
      fn(req, res, next, result);
    } else {
      isError = true;
      status = 404;
      message = `No data with ID ${req.params.id} was found.`;
    }
  } else {
    isError = true;
    status = 400;
    message = `Invalid ID ${requestID}.`;
  }

  if (isError) {
    next(new ErrorResponse(message, status));
  }
};

export const validateArrData = (fn, model) => async (req, res, next) => {
  const errorResults = [];
  //MongoDB Schema type error for multiple posts.
  if (Array.isArray(req.body)) {
    for (const doc of req.body) {
      try {
        await model.validate(doc);
      } catch ({ errors }) {
        const dataErrorMsg = getErrorMessage(errors, SCHEMA_ERROR_KEYS);

        errorResults.push({
          dataErrorMsg,
          data: doc,
        });
      }
    }
  }

  if (errorResults.length) {
    next(
      new ErrorResponse(
        'Some data could not be processed due to validation errors.',
        400,
        errorResults
      )
    );
  } else {
    fn(req, res, next);
  }
};
