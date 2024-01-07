import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.AdminUser ||
  mongoose.model("AdminUser", adminUserSchema);
