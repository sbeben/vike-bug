import { resolve } from "node:path";

/**
 * Absolute project root.
 *
 * In dev (ts-node) and in prod (compiled to dist/cli), `import.meta.url`/`__dirname`
 * point to different directories. Using `process.cwd()` keeps asset paths stable
 * across environments (Docker sets WORKDIR to /app).
 */
export const directoryRoot = resolve(process.cwd());
