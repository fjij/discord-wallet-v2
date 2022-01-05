import dotenv from "dotenv";
dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN!,
  mongoUri: process.env.MONGO_URI!,
  applicationId: process.env.APPLICATION_ID!,
};
