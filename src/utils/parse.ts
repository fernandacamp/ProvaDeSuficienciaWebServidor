import { IncomingMessage } from "http";

export function parseBody<T = any>(req: IncomingMessage): Promise<T> {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const data = Object.fromEntries(new URLSearchParams(body)) as unknown as T;
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });

        req.on("error", (err) => reject(err));
    });
}
