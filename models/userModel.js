const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Field required"],
  },
  lastname: {
    type: String,
    required: [true, "Last Name Field required"],
  },
  email: {
    type: String,
    requrired: [true, "Email Field required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide A vaild Email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please Provide a Password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    requrired: [true, "Please Provide a Password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password Confirm does not match",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //run the code only if the password is modified
  //hash the password with power of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassowrd = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp > changedTimeStamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
