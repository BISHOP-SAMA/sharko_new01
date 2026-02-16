import { z } from "zod";

export const insertRegistrationSchema = z.object({
  walletAddress: z.string()
    .min(1, "Wallet address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM wallet address"),
  xUsername: z.string().optional().nullable(),
  discordUsername: z.string().optional().nullable(),
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
