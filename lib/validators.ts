import { z } from "zod";

export const shortenUrlSchema = z.object({
    url: z.string().url({ message: "Please enter a valid URL" }),
});

export const qrCodeSchema = z.object({
    content: z.string().min(1, { message: "Content is required" }),
    size: z.number().min(100).max(1000).default(300),
    fgColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: "Invalid color" }).default("#000000"),
    bgColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: "Invalid color" }).default("#ffffff"),
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;
export type QrCodeInput = z.infer<typeof qrCodeSchema>;
