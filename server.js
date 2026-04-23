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
            const filePath = path.join(__dirname, pathname);
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
    } else if (method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            let parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({success: false, error: "Invalid JSON"}));
                return;
            }
            if (parsedBody.action === "selectGame") {
                const response = {
                    success: true,
                    message: `Game ${parsedBody.gameType} selected`,
                    gameType: parsedBody.gameType
                };
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(response));
            } else {
                const response = {success: true, message: "POST request received"};
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(response));
            }
        });
    } else {
        res.writeHead(405);
        res.end("Method not allowed");
    }
});

server.listen(8000, () => {
    console.log("Server running at http://localhost:8000/");
});
