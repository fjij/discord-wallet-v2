import dotenv from "dotenv";
dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN!,
  chainId: parseInt(process.env.CHAIN_ID!),
  mongoUri: process.env.MONGO_URI!,
};
