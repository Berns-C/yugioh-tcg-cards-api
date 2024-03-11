import { getErrorMessage } from '../utilities/error';
import { SCHEMA_ERROR_KEYS } from '../data/constant_variables';

const errorHandler = (error, req, res, next) => {
  const content: any = {
    success: false,
    error: error.message,
    errorResults: error.errorResults,
  };

  let status = error.status || 500;

  if (!error.errorResults && error.errors) {
    //MongoDB Schema type error for update.
    content.error = getErrorMessage(error.errors, SCHEMA_ERROR_KEYS);
    status = 400;
  }

  if (error?.code) {
    //MongoDB Errors
    if (error?.code === 11000) {
      const { writeErrors, insertedDocs } = error;
      status = 400;

      if (writeErrors && insertedDocs) {
        content.errorEntriesCount = writeErrors.length;
        content.error_entries = writeErrors.map(({ err }) => {
          return {
            name: err.op.name || err.op.cardName,
          };
        });

        content.succesfulEntriesCount = insertedDocs.length;
        content.succesful_entries = insertedDocs.map((successCard) => {
          return {
            new_id: successCard._id,
            name: successCard.name || successCard.cardName,
          };
        });

        content.error = insertedDocs
          ? 'All entries are duplicates and could not be added to database.'
          : 'Some entries were added successfully, while others encountered duplicate errors.';
      }

      if (error.keyValue) {
        content.error = `The data ${
          error.keyValue?.name || error.keyValue?.cardName
        } you are attempting to add already exists in the system.`;
      }
    }
  }

  res.status(status).json({
    ...content,
  });
};

export default errorHandler;
