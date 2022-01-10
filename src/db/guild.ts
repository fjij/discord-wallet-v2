import mongoose, { Schema } from "mongoose";

export interface Guild {
  guildId: string;
  chainId: number;
  symbol: string;
}

export const GuildModel = mongoose.model<Guild>(
  "Guild",
  new Schema<Guild>({
    guildId: { type: String, unique: true, required: true },
    chainId: { type: Number, required: true, default: 1 },
    symbol: { type: String, required: true, default: "ETH" },
  })
);
