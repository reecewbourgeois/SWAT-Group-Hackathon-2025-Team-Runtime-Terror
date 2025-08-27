import { z } from "zod";

export const REFRESH_HEADER = "X-Access-Token";
export const ISSUER = "trpc-passwordless-api";

export const EmailSchema = z.email().max(254, "Email too long");
export const AccessCodeSchema = z.string().min(1).max(128);