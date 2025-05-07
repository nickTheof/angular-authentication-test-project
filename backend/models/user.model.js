const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, "Firstname is required field"],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "Lastname is required field"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      validate: [validator.isEmail, "Email has not valid format"],
    },
    password: {
      type: String,
      select: false,
    },
    roles: {
      type: [String],
      enum: ["ADMIN", "EDITOR", "USER"],
      default: ["USER"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
