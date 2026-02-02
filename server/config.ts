import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const configSchema = z.object({
  FLY_ALLOC_ID: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SERVER_PORT: z.string(),
  PUBLIC_HOST: z.string().trim(),
});

export type Config = z.infer<typeof configSchema>

//might be async
export const createConfig = async (): Promise<Config> => {
  // Align defaults with Docker/Fly config (internal port 4000).
  const serverPort = globalThis.process.env.SERVER_PORT ?? "4000";
  const envObj: (typeof configSchema)["_input"] = {
    FLY_ALLOC_ID: globalThis.process.env.FLY_ALLOC_ID,
    PUBLIC_HOST: globalThis.process.env.PUBLIC_ENV__HOST ?? `http://localhost:${serverPort}`,
    NODE_ENV: globalThis.process.env.NODE_ENV as "development" | "production" | "test",
    SERVER_PORT: serverPort,
  };

  const envServer = configSchema.safeParse(envObj);

  if (!envServer.success) {
    console.error("There is an error with the server environment variables", envServer.error.issues);
    process.exit(1);
  }

  console.log("Application config created");
  return envServer.data;
};

export const CONFIG: Config = await createConfig();
