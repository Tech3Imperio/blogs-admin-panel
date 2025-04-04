import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<Users>({
  email: {
    type: String,
    required: [true, "Email is required"],
    maxlength: [60, "Email cannot be more that 60 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

export interface OTPs extends mongoose.Document {
  pin: string;
}

const OTPSchema = new mongoose.Schema<OTPs>({
  pin: {
    type: String,
    required: [true, "OTP is required"],
    maxlength: [6, "OTP cannot be more that 6 characters"],
    minlength: [6, "OTP cannot be less than 6 characters"],
  },
});

export const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
