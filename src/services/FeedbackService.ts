import Feedback from "../models/Feedback";
import { FeedbackData } from "../interface/FeedbackData";
import { Status } from "../enum/statusEnum";
import { Tipo } from "../enum/tipoEnum";

export default class FeedbackService {
    static async getFeedbacks() {
        return Feedback.getAll();
    }

    static async getByIdFeedback(id: number) {
        return Feedback.getById(id);
    }

    static async createFeedback(data: FeedbackData) {
        const feedback = new Feedback(data.titulo, data.descricao, data.tipo);
        return Feedback.create(feedback);
    }

    static async updateStatus(id: number, status: Status) {
        return Feedback.updateStatus(id, status);
    }
}
