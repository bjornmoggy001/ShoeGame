import dotenv from "dotenv";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

//explicitly load env variables from Next's .env.local
dotenv.config({path: ".env.local"});

//check if DIRECT_URL is really there instead of lying to TypeScript and then it fails silently
const directUrl = process.env.DIRECT_URL;
//if not fail loudly
if(!directUrl) {
    throw new Error(
        "FATAL: DIRECT_URL is missing, Check your .env.local file or environment setup"
    )
}

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/schema.prisma",
    db: {
      connection: directUrl,
    },
  }),
});
