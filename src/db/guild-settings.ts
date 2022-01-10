import mongoose, { Schema } from "mongoose";

export interface GuildSettings {
  guildId: string;
  chainId: number;
  symbol: string;
}

export const GuildSettingsModel = mongoose.model<GuildSettings>(
  "Guild",
  new Schema<GuildSettings>({
    guildId: { type: String, unique: true, required: true },
    chainId: { type: Number, required: true, default: 1 },
    symbol: { type: String, required: true, default: "ETH" },
  })
);
