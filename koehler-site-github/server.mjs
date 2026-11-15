/**
 * Local preview server for the built site.
 * Clean URLs, exact case sensitivity, and a stub /api/request endpoint.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import worker from "./worker.js";

const base = dirname(fileURLToPath(import.meta.url));
const root = join(base, "dist");
const port = Number(process.env.PORT || 3000);

// Minimal .env support so the forms can be tested locally with a real key.
try {
  const envFile = await readFile(join(base, ".env"), "utf8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  /* no .env — fine */
}

const workerEnv = {
  ASSETS: { fetch: async () => new Response("", { status: 404 }) },
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FORM_WEBHOOK_URL: process.env.FORM_WEBHOOK_URL,
  CONTACT_TO: process.env.CONTACT_TO,
  CONTACT_FROM: process.env.CONTACT_FROM,
  CONTACT_CC: process.env.CONTACT_CC,
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

async function send(res, file, status = 200) {
  try {
    const body = await readFile(file);
    res.writeHead(status, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(body);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Delegate the form endpoint to the real worker so local behaviour matches
  // production — including refusing to claim success when nothing is configured.
  if (url.pathname.startsWith("/api/")) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: body.length ? body : undefined,
    });
    const result = await worker.fetch(request, workerEnv, {});
    res.writeHead(result.status, Object.fromEntries(result.headers));
    res.end(Buffer.from(await result.arrayBuffer()));
    return;
  }

  const path = decodeURIComponent(url.pathname);
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");

  // exact clean URL first
  const candidates =
    safe === "/"
      ? [join(root, "index.html")]
      : [join(root, `${safe}.html`), join(root, safe, "index.html"), join(root, safe)];

  for (const candidate of candidates) {
    try {
      const s = await stat(candidate);
      if (s.isFile()) {
        if (await send(res, candidate)) return;
      }
    } catch {
      /* keep looking */
    }
  }

  if (await send(res, join(root, "404.html"), 404)) return;
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Preview: http://0.0.0.0:${port}`);
});
