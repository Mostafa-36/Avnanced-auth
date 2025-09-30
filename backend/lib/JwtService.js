import jwt from "jsonwebtoken";
import { promisify } from "util";

export default class JwtService {
  constructor(secret, expiresIn = "1h") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return jwt.sign({ id: payload }, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  async verify(token) {
    return await promisify(jwt.verify)(token, this.secret);
  }
}
