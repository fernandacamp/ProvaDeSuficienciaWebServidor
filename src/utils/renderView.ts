import path from "path";
import ejs from "ejs";
import { ServerResponse } from "http";

export function renderView(res: ServerResponse, viewName: string, data: any = {}) {
    const filePath = path.join(__dirname, "../views", viewName + ".ejs");
    ejs.renderFile(filePath, data, {}, (err, str) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Erro ao renderizar view: " + err.message);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
    });
}
