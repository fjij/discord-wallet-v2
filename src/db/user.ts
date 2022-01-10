import mongoose, { Schema } from "mongoose";

export interface User {
  userId: string;
  account: string;
  signature: string;
}

export const UserModel = mongoose.model<User>(
  "User",
  new Schema<User>({
    userId: { type: String, unique: true, required: true },
    account: { type: String, required: true },
    signature: { type: String, required: true },
  })
);
