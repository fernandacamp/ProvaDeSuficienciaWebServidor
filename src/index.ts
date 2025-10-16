import http from "http";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { router } from "./routes";
import Conexao from "./models/Conexao";

Conexao.init()
    .then(() => {
        const server = http.createServer((req, res) => {

            router(req, res).catch((err: unknown) => {
                console.error("Erro no servidor:", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Erro interno do servidor");
            });
            
        });

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((err: unknown) => {
        console.error("Falha ao inicializar banco:", err);
    });
