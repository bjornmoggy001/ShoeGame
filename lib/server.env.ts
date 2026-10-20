import * as z from "zod";
import { prettifyError } from "zod";
import "server-only";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  //database secrets
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: "DATABASE_URL must start with postgresql:// or postgres://",
  }),
  DIRECT_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: "DIRECT_URL must start with postgresql:// or postgres://",
  }),

  //auth secret
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters long"),

  //stripe secrets
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET required"),

  //mpesa secrets and server configs
  MPESA_ENVIRONMENT: z.enum(["sandbox", "production"]),
  MPESA_CONSUMER_KEY: z.string().min(1, "MPESA_CONSUMER_KEY required"),
  MPESA_CONSUMER_SECRET: z.string().min(1, "MPESA_CONSUMER_SECRET required"),
  MPESA_PASSKEY: z.string().min(1, "MPESA_PASSKEY required"),
  MPESA_SHORTCODE: z.string().min(1, "MPESA_SHORTCODE required"),
  MPESA_CALLBACK_URL: z.url({
    protocol: /^https$/,
    error: "MPESA_CALLBACK_URL must be a valid url",
  }),
});

const parseServerEnv = () => {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid or missing environment variables");
    const prettifiedError = prettifyError(result.error);
    console.log(prettifiedError);
    throw new Error(
      "Invalid server environment variables, fix .env setup and restart",
    );
  }
  return {
    ...result.data,
    MPESA_BASE_URL:
      result.data.MPESA_ENVIRONMENT === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke",
  };
};

export const serverEnv = parseServerEnv();
