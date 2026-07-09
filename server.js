const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

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
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end(data);
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
                        ".wav": "audio/wav"
                    };
                    const mimeType = mimeTypes[ext] || "application/octet-stream";
                    res.writeHead(200, {
                        "Content-Type": mimeType,
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        "Pragma": "no-cache",
                        "Expires": "0"
                    });
                    res.end(data);
                }
            });
        }
    } else {
        res.writeHead(405);
        res.end("Method not allowed");
    }
});

server.listen(8000, () => {
    console.log("Server running at http://localhost:8000/");
});
