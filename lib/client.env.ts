import { prettifyError, z } from "zod";

const clientEnvSchema = z.object({
  // stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY required"),
});

const parseClientEnv = () => {
  // Explicitly reference the literal property so Next.js can perform its build-time inlining
  const clientEnv = {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  };

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    console.error("Invalid or missing client environment variables:");
    const prettifiedError = prettifyError(result.error);
    console.log(prettifiedError);
    throw new Error(
      "Invalid client environment variables. Fix .env setup and restart.",
    );
  }

  return result.data;
};

export const clientEnv = parseClientEnv();
