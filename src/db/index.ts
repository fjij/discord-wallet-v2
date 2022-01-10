import mongoose from "mongoose";

import { config } from "../config";

export async function initDb() {
  await mongoose.connect(config.mongoUri);
}

export * from "./connected-user";
export * from "./guild-settings";
