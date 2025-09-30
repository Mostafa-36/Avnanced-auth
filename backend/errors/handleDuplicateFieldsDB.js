import AppError from "./AppError.js";

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const message = `Duplicate field value for "${field}": "${value}". Please use another value!`;
  return new AppError(message, 400);
};

export default handleDuplicateFieldsDB;
