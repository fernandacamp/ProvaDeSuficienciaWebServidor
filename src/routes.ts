import { IncomingMessage, ServerResponse } from "http";
import FeedbackController from "./controllers/FeedbackController";
import { parseLogin } from "./utils/parseLogin";
import { ensureAuth, login, logout } from "./utils/auth";
import fs from "fs";
import path from "path";

export async function router(req: IncomingMessage, res: ServerResponse) {

    const url = (req.url || "/").split("?")[0];
    const method = req.method || "GET";

     if (url.startsWith("/css/")) {
        const filePath = path.join(__dirname, "public", url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Arquivo não encontrado");
            } else {
                res.writeHead(200, { "Content-Type": "text/css" });
                res.end(data);
            }
        });
        return;
    }


    if (url === "/" && method === "GET") {
        return FeedbackController.form(req, res);
    }

    if (url === "/feedback/cadastrar" && method === "POST") {
        return FeedbackController.store(req, res);
    }

    if (url === "/login" && method === "GET") {
        return FeedbackController.login(req, res);
    }

    if (url === "/login" && method === "POST") {
        const { usuario, senha } = await parseLogin(req);
        const success = login(req, res, usuario, senha);

        if (!success) {
            return FeedbackController.login(req, res, "Usuário ou senha inválidos");
        }
        return; 
    }

    if (url === "/logout" && method === "GET") {
        return logout(req, res);
    }

    if (!ensureAuth(req, res)) {
        return; 
    }

    if (url === "/feedbacks" && method === "GET") {
        return FeedbackController.index(req, res);
    }

    if (url.startsWith("/feedbacks/") && method === "GET") {
        const idStr = url.split("/")[2];
        return FeedbackController.show(req, res, idStr);
    }

    if (url === "/feedback/atualizar" && method === "PUT") {
        return FeedbackController.update(req, res);
    }

    console.log(` Rota não encontrada: ${method} ${url}`);
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
    <script>
        alert("Erro 404 - Página não encontrada!");
        window.location.href = "/"; 
    </script>
`);

}