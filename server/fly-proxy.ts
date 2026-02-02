import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { type FastifyPluginCallback } from "fastify";

import { CONFIG } from "./config.js";

function remapHeader(headers: Record<string, string | undefined>, to: string, from: string) {
  if (headers[from]) {
    headers[to] = headers[from];
    delete headers[from];
  }
}

const flyMiddleware: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook("onRequest", (request: FastifyRequest, _reply: FastifyReply, done) => {
    remapHeader(request.headers as Record<string, string>, "x-forwarded-proto", "fly-forwarded-proto");
    remapHeader(request.headers as Record<string, string>, "x-forwarded-port", "fly-forwarded-port");
    remapHeader(request.headers as Record<string, string>, "x-forwarded-ssl", "fly-forwarded-ssl");
    done();
  });
  done();
};

export async function applyFlyProxy(app: FastifyInstance) {
  if (!CONFIG.FLY_ALLOC_ID) {
    // Not running on fly
    return;
  }

  // Trust proxy is already set in your server config, but you can also set it here if needed
  // app.set('trustProxy', true);

  // Register the middleware
  await app.register(flyMiddleware);
}
