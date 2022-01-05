import mongoose, { Schema } from "mongoose";

import { config } from "./config";

export async function initDb() {
  await mongoose.connect(config.mongoUri);
}

export const User = mongoose.model("User", new Schema({
  userId: { type: String, unique: true, required: true },
  account: { type: String, required: true },
  signature: { type: String, required: true },
}));

export const Guild = mongoose.model("Guild", new Schema({
  guildId: { type: String, unique: true, required: true },
  chainId: { type: Number, required: true, default: 1 },
  symbol: { type: String, required: true, default: "ETH" },
}));
