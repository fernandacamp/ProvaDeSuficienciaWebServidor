import { IncomingMessage, ServerResponse } from "http";

const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";
const SESSION_DURATION = 3600000 ; //1h em milissegundos 

const sessions: Record<string, number> = {};

function cleanExpiredSessions() {
    const now = Date.now();
    Object.keys(sessions).forEach(sessionId => {
        if (sessions[sessionId] < now) {
            delete sessions[sessionId];
        }
    });
}

function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function getSessionIdFromCookie(req: IncomingMessage): string | null {
    const cookie = req.headers["cookie"];
    if (!cookie) return null;

    const cookies = cookie.split(";").map(s => s.trim());
    
    for (const c of cookies) {
        const [key, value] = c.split("=");
        if (key === "session") {
            return value;
        }
    }

    return null;
}

export function isAuthenticated(req: IncomingMessage): boolean {
    cleanExpiredSessions();
    
    const sessionId = getSessionIdFromCookie(req);
    if (!sessionId || !sessions[sessionId]) return false;

    const expiresAt = sessions[sessionId];
    if (expiresAt > Date.now()) {
        sessions[sessionId] = Date.now() + SESSION_DURATION;
        return true;
    } else {
        delete sessions[sessionId];
        return false;
    }
}

export function ensureAuth(req: IncomingMessage, res: ServerResponse): boolean {
    if (isAuthenticated(req)) return true;

    res.writeHead(302, { Location: "/login" });
    res.end();
    return false;
}


export function login(req: IncomingMessage, res: ServerResponse, usuario: string, senha: string): boolean {
    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {

        const sessionId = generateSessionId();
        const expiresAt = Date.now() + SESSION_DURATION;
        sessions[sessionId] = expiresAt;

        const expiresDate = new Date(expiresAt);

        res.writeHead(302, {
            "Set-Cookie": `session=${sessionId}; HttpOnly; Path=/; SameSite=Lax; Expires=${expiresDate.toUTCString()}`,
            Location: "/feedbacks",
        });
        res.end();
        return true;
    }

    return false;
}


export function logout(req: IncomingMessage, res: ServerResponse): void {
    const sessionId = getSessionIdFromCookie(req);
    
    if (sessionId) {
        delete sessions[sessionId];
    }

    res.writeHead(302, {
        "Set-Cookie": "session=; HttpOnly; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        Location: "/login",
    });
    res.end();
}