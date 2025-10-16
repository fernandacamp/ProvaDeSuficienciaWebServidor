import { Status } from "../enum/statusEnum";
import { Tipo } from "../enum/tipoEnum";

export interface FeedbackData {
    id?: number;
    titulo: string;
    descricao: string;
    tipo: Tipo;
    status: Status;
}