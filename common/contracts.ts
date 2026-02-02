
import z from "zod";

const authSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export const api = {
  AUTH: authSchema,
};

export type API = {
  AUTH: z.infer<typeof authSchema>;
};
