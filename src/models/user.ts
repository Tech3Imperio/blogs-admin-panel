import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  name: string;
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
