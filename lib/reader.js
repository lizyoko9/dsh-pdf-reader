import { execFile } from "node:child_process";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const PREFIX = "/pdf-reader";
const SCRIPT = fileURLToPath(new URL("../assets/pdf_search.py", import.meta.url));
const TOKEN = randomBytes(24).toString("base64url");

function send(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-pdf-reader-token",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(data),
  });
  res.end(data);
}

function authorized(req) {
  const value = req.headers["x-pdf-reader-token"];
  if (typeof value !== "string") return false;
  const given = Buffer.from(value);
  const expected = Buffer.from(TOKEN);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

function pythonOf(venv) {
  return process.platform === "win32"
    ? path.join(venv, "Scripts", "python.exe")
    : path.join(venv, "bin", "python");
}

async function hasPypdf(python) {
  try {
    await execFileAsync(python, ["-c", "import pypdf"], { timeout: 8000 });
    return true;
  } catch {
    return false;
  }
}

let pythonPromise;

async function ensurePython() {
  if (pythonPromise !== undefined) return pythonPromise;
  pythonPromise = (async () => {
    const home = os.homedir();
    const candidates = [
      path.join(home, ".dsh", "pdf-reader", "venv"),
      path.join(home, ".dsh", "formula-verify", "venv"),
    ];
    for (const venv of candidates) {
      const python = pythonOf(venv);
      if (await hasPypdf(python)) return python;
    }

    const venv = path.join(home, ".dsh", "pdf-reader", "venv");
    const python = pythonOf(venv);
    const launcher = process.platform === "win32" ? "python" : "python3";
    await execFileAsync(launcher, ["-m", "venv", venv], { timeout: 120000 });
    await execFileAsync(python, ["-m", "pip", "install", "--quiet", "pypdf"], {
      timeout: 180000,
      maxBuffer: 8 * 1024 * 1024,
    });
    if (!(await hasPypdf(python))) throw new Error("pypdf install did not produce a usable python");
    return python;
  })().catch((error) => {
    pythonPromise = undefined;
    throw error;
  });
  return pythonPromise;
}

async function search(file, query) {
  const abs = path.resolve(file);
  if (!/\.pdf$/i.test(abs)) throw new Error("only .pdf files are supported");
  const info = await stat(abs).catch(() => undefined);
  if (info === undefined || !info.isFile()) throw new Error("pdf file not found");
  const python = await ensurePython();
  const { stdout } = await execFileAsync(
    python,
    [SCRIPT, "--file", abs, "--query", query, "--limit", "500"],
    { timeout: 120000, maxBuffer: 20 * 1024 * 1024 },
  );
  const data = JSON.parse(stdout);
  if (data.ok !== true) throw new Error(data.error || "pdf search failed");
  return data;
}

export function installPdfReader(ctx) {
  if (typeof ctx.inject !== "function") return;
  ctx.inject(["webServer"], (child) => {
    const web = child.webServer;
    child.effect(() => web.register({
      kind: "prefix",
      path: PREFIX,
      handler: async (req, res) => {
        if (req.method === "OPTIONS") {
          res.writeHead(204, {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, OPTIONS",
            "access-control-allow-headers": "content-type, x-pdf-reader-token",
          });
          res.end();
          return;
        }
        if (!authorized(req)) {
          send(res, 401, { ok: false, error: "missing or invalid pdf-reader token" });
          return;
        }
        try {
          const url = new URL(req.url ?? PREFIX, "http://pdf-reader.local");
          if (url.pathname !== `${PREFIX}/search`) {
            send(res, 404, { ok: false, error: "not found" });
            return;
          }
          const file = url.searchParams.get("path") ?? "";
          const query = (url.searchParams.get("q") ?? "").trim();
          if (file === "") {
            send(res, 400, { ok: false, error: "path is required" });
            return;
          }
          if (query === "" || query.length > 300) {
            send(res, 400, { ok: false, error: "query must be 1-300 characters" });
            return;
          }
          send(res, 200, { ok: true, ...(await search(file, query)) });
        } catch (error) {
          send(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
        }
      },
    }), "pdf-reader: routes");

    child.effect(() => child.on("webserver/index-inject", (rows) => {
      if (web.protocol !== "http:" && web.protocol !== "https:") return;
      let origin = "";
      try {
        origin = web.getOrigin?.() ?? "";
      } catch {
        origin = "";
      }
      rows.push({
        kind: "global",
        name: "__PDF_READER__",
        value: { token: TOKEN, endpoint: PREFIX, origin },
      });
    }), "pdf-reader: index config");
  });
}
