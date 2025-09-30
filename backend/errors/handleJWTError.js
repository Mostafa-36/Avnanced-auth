import AppError from "./AppError.js";

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

export default handleJWTError;
