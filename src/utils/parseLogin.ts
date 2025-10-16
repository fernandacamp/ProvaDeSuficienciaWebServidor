import { IncomingMessage } from "http";

export interface LoginData {
    usuario: string;
    senha: string;
}

export function parseLogin(req: IncomingMessage): Promise<LoginData> {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const params = Object.fromEntries(new URLSearchParams(body));
                resolve({
                    usuario: params["usuario"] || "",
                    senha: params["senha"] || "",
                });
            } catch (err) {
                resolve({ usuario: "", senha: "" });
            }
        });

        req.on("error", (err) => {
            reject(err);
        });
    });
}
