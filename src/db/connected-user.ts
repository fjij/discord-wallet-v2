import mongoose, { Schema } from "mongoose";

export interface ConnectedUser {
  userId: string;
  account: string;
  signature: string;
}

export const ConnectedUserModel = mongoose.model<ConnectedUser>(
  "User",
  new Schema<ConnectedUser>({
    userId: { type: String, unique: true, required: true },
    account: { type: String, required: true },
    signature: { type: String, required: true },
  })
);
