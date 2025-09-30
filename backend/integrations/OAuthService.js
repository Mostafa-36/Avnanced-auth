import JwtService from "../lib/JwtService.js";
import { User } from "../models/user.model.js";
import { sendWelcomeEmail } from "./EmailService/emails.js";

export default class OAuthService {
  constructor(config, handleProvider) {
    this.config = config;
    this.handleProvider = handleProvider;
  }

  async authenticate(code) {
    const providerData = await this.handleProvider(code, this.config);

    let user = await User.findOne({
      provider: this.config.provider,
      oauthId: providerData.id,
    });

    if (!user) {
      user = await User.create({
        email: providerData.email,
        name: providerData.name,
        provider: this.config.provider,
        oauthId: providerData.id,
        avatar: providerData.avatar,
      });

      if (user.email) await sendWelcomeEmail(user.email, user.name || "");
    }

    return { user };
  }
}
