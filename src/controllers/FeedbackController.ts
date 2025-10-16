import { IncomingMessage, ServerResponse } from "http";
import FeedbackService from "../services/FeedbackService";
import { parseBody } from "../utils/parse";
import { Status } from "../enum/statusEnum";
import { renderView } from "../utils/renderView";
import { Tipo } from "../enum/tipoEnum";

export default class FeedbackController {
    static async form(req: IncomingMessage, res: ServerResponse, error = "", oldData: any = {}, mensagem?: string, data?: any) {
        return renderView(res, "formulario_view", {
            error,
            mensagem: mensagem || "",
            data: data || {},
            titulo: oldData.titulo || "",
            descricao: oldData.descricao || "",
            tipo: oldData.tipo || "",
            Tipo,
        });
    }

    static async login(req: IncomingMessage, res: ServerResponse, error = "") {
        return renderView(res, "login_view", { error });
    }

    static async index(req: IncomingMessage, res: ServerResponse, error = "") {
        try {
            const list = await FeedbackService.getFeedbacks();
            const rows = list.map(f =>
                `<tr>
                    <td>${f.id}</td>
                    <td>${f.titulo}</td>
                    <td>${f.tipo}</td>
                    <td><a href='/feedbacks/${f.id}' class='btn btn-sm btn-primary rounded-pill shadow-sm'>
                        Detalhes
                    </a></td>
                </tr>`
            ).join("");
            return renderView(res, "feedbacks_view", {
                feedbacks_rows: rows,
                error
            });
        } catch (err: any) {
            return renderView(res, "feedbacks_view", {
                feedbacks_rows: "",
                error: "Erro ao listar feedbacks: " + err.message
            });
        }
    }

    static async show(req: IncomingMessage, res: ServerResponse, idStr: string, error = "") {
        try {
            const id = Number(idStr);
            const f = await FeedbackService.getByIdFeedback(id);

            // Gera as opções do dropdown de status
            const statuses = Object.values(Status);
            const options = statuses
                .map(s => `<option value="${s}" ${s === f.status ? "selected" : ""}>${s}</option>`)
                .join("");

            return renderView(res, "feedbacks_show_view", {
                id: f.id,
                titulo: f.titulo,
                descricao: f.descricao,
                tipo: f.tipo,
                status_options: options,
                error
            });
        } catch (err: any) {
            return renderView(res, "feedbacks_show_view", {
                id: 0,
                titulo: "Não encontrado",
                descricao: "Não encontrado",
                tipo: "Não encontrado",
                status_options: "",
                error: "Feedback não encontrado: " + err.message
            });
        }
    }

    static async store(req: IncomingMessage, res: ServerResponse) {
        try {
            const data = await parseBody(req);
            await FeedbackService.createFeedback(data);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(`
            <script>
                alert("Feedback enviado com sucesso!");
                window.location.href = "/feedbacks";
            </script>
        `);
        } catch (err: any) {
            const parsedData = await parseBody(req);
            return this.form(req, res, err.message, parsedData);
        }
    }


    static async update(req: IncomingMessage, res: ServerResponse) {
        try {
            const data = await parseBody(req);
            const id = Number(data.id);
            const status = data.status as Status;

            await FeedbackService.updateStatus(id, status);
            res.end();
        } catch (err: any) {

            const data = await parseBody(req);
            return this.show(req, res, data.id, "Erro ao atualizar: " + err.message);
        }
    }
}