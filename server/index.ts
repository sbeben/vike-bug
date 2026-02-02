import "dotenv/config";
import { networkInterfaces } from "os";

import { CONFIG } from "./config.js";
import { createServer } from "./server.js";

const isProduction = CONFIG.NODE_ENV === "production";
const app = await createServer(isProduction);
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      // Skip internal and non-IPv4 addresses
      if (!net.internal && net.family === "IPv4") {
        return net.address;
      }
    }
  }
  return null;
}
const localIP = getLocalIP();

console.log("Server routes:\r\n", app.printRoutes());

const listenHost = await app.listen({ host: "0.0.0.0", port: Number(CONFIG.SERVER_PORT) });
console.info(`Server listening at ${listenHost}`);
if (localIP) {
  console.info(`Access from mobile at http://${localIP}:${CONFIG.SERVER_PORT}`);
}
// Listen to typical SIGINT and SIGTERM signals
// so that we can gracefully close the server
// and enable rolling update strategy.
process.on("SIGINT", async () => {
  console.info(`\r\nReceived signal: SIGNING. Waiting for connections to close...`);
  await app.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.info(`\r\nReceived signal: SIGTERM. Killing immediately...`);
  process.exit(0);
});

// Vercel handler
// export default async (req: Request, res: Response) => {
//   await app.ready();
//   app.server.emit("request", req, res);
// };
