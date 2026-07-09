const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === "GET") {
        if (pathname === "/") {
            fs.readFile("index.html", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found");
                } else {
                    sendRes(res, req, data, "text/html");
                }
            });
        } else {
            // Resolve within the server root and reject any path that escapes it.
            const root = __dirname;
            const resolved = path.resolve(root, "." + path.normalize(pathname));
            if (!resolved.startsWith(root)) {
                res.writeHead(403);
                res.end("Forbidden");
                return;
            }
            const filePath = resolved;
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("File not found");
                } else {
                    const ext = path.extname(filePath);
                    const mimeTypes = {
                        ".html": "text/html",
                        ".css": "text/css",
                        ".js": "application/javascript",
                        ".png": "image/png",
                        ".jpg": "image/jpeg",
                        ".gif": "image/gif",
                        ".mp4": "video/mp4",
                        ".mp3": "audio/mpeg",
                        ".ogg": "audio/ogg",
                        ".wav": "audio/wav",
                        ".txt": "text/plain"
                    };
                    const mimeType = mimeTypes[ext] || "application/octet-stream";
                    // The broad dictionary is large (2MB+); let the client cache
                    // it so mobile/tailnet sessions don't re-fetch every load.
                    const cacheable = (ext === ".txt");
                    const headers = { "Content-Type": mimeType };
                    if (cacheable) {
                        headers["Cache-Control"] = "public, max-age=3600";
                    } else {
                        headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                        headers["Pragma"] = "no-cache";
                        headers["Expires"] = "0";
                    }
                    sendRes(res, req, data, mimeType, headers);
                }
            });
        }
    } else {
        res.writeHead(405);
        res.end("Method not allowed");
    }
});

// Send a response, transparently gzip-compressing when the client accepts it.
// Browsers auto-decompress, so this just makes large payloads (the 2MB
// dictionary) reliable over slow links (mobile/tailnet) without client changes.
function sendRes(res, req, data, mimeType, extraHeaders = {}) {
    const acceptGzip = (req.headers["accept-encoding"] || "").includes("gzip");
    const compressible = [".html", ".css", ".js", ".txt"].some(ext => mimeType.includes(ext)) ||
        mimeType === "text/plain";
    if (acceptGzip && compressible) {
        zlib.gzip(data, (err, gz) => {
            if (err) {
                res.writeHead(200, { "Content-Type": mimeType, ...extraHeaders });
                res.end(data);
                return;
            }
            res.writeHead(200, {
                "Content-Type": mimeType,
                "Content-Encoding": "gzip",
                ...extraHeaders
            });
            res.end(gz);
        });
    } else {
        res.writeHead(200, { "Content-Type": mimeType, ...extraHeaders });
        res.end(data);
    }
}

server.listen(8000, () => {
    console.log("Server running at http://localhost:8000/");
});
