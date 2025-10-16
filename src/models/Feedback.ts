import Conexao from "./Conexao";
import { Status } from "../enum/statusEnum";
import { Tipo } from "../enum/tipoEnum";

export default class Feedback extends Conexao {
    id: number;
    titulo: string;
    descricao: string;
    tipo: Tipo;
    status: Status;

    constructor(titulo: string, descricao: string, tipo: Tipo) {
        super();
        this.id = 0;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipo = tipo;
        this.status = Status.Recebido;
    }

    static async getAll() {
        const result = await this.query("SELECT * FROM feedback ORDER BY id ASC");
        return result.rows;
    }

    static async getById(id: number) {
        const result = await this.query("SELECT * FROM feedback WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async create(f: Feedback) {
        const result = await this.query(
            "INSERT INTO feedback (titulo, descricao, tipo, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [f.titulo, f.descricao, f.tipo, f.status]
        );
        return result.rows[0];
    }

    static async updateStatus(id: number, status: Status) {
        const result = await this.query(
            "UPDATE feedback SET status=$1 WHERE id=$2 RETURNING *",
            [status, id]
        );
        return result.rows[0];
    }
}
