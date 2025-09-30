import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    provider: {
      type: String,
      default: "local",
    },
    password: {
      type: String,
      select: false,
      minlength: 6,
      required: function () {
        return this.provider === "local";
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    oauthId: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.validatePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
