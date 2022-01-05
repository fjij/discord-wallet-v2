import mongoose, { Schema } from "mongoose";

import { config } from "./config";

export async function initDb() {
  await mongoose.connect(config.mongoUri);
}

export const Signature = mongoose.model("Signature", new Schema({
  userId: { type: String, unique: true, required: true },
  account: { type: String, required: true },
  signature: { type: String, required: true },
}));
