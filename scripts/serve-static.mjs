// Minimal static server for the exported site (out/), used by the tests.
// Serves folder/index.html for trailing-slash URLs and 404.html otherwise.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = new URL("../out/", import.meta.url).pathname;
const port = Number(process.env.PORT || 4173);
// Serve under a prefix, like GitHub Pages does (BASE_PATH=/Gusinje after a build with NEXT_PUBLIC_BASE_PATH).
const base = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (base && url.pathname !== base && !url.pathname.startsWith(`${base}/`)) {
    res.writeHead(404, { "content-type": types[".html"] });
    res.end("Not found");
    return;
  }
  let path = normalize(decodeURIComponent(url.pathname.slice(base.length) || "/")).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  else if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": types[".html"] });
    createReadStream(join(root, "404.html")).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving out/ on http://localhost:${port}`));
