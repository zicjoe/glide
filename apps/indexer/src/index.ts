import { startServer } from "./api/server.js";
import { initSchema } from "./schema.js";

async function main() {
  await initSchema();
  startServer();
  console.log("indexer ready");
}

void main();