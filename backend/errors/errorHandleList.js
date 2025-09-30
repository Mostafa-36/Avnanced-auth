import handleValidationErrorDB from "./handleValidationErrorDB.js";
import handleCastErrorDB from "./handleCastErrorDB.js";
import handleDuplicateFieldsDB from "./handleDuplicateFieldsDB.js";
import handleJWTError from "./handleJWTError.js";

const errorHandlersList = [
  {
    match: (err) => err.name === "ValidationError",
    helper: handleValidationErrorDB,
  },
  {
    match: (err) => err.name === "CastError",
    helper: handleCastErrorDB,
  },
  {
    match: (err) => err.code === 11000,
    helper: handleDuplicateFieldsDB,
  },
  {
    match: (err) => err.name === "JsonWebTokenError",
    helper: handleJWTError,
  },
];

export default errorHandlersList;
