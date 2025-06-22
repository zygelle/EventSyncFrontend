import { PaginatedEventsSchema, type FilterRequest, FilterRequestSchema } from "../../schemas/EventSchema.tsx";
import api from "./api.tsx";

export const fetchEventsWithFilter =
    async (filter: FilterRequest, page: number) => {
    const message:string = "Erro ao buscar eventos. Por favor, se o erro persistir tente novamente mais tarde."
    try {
        const validation = FilterRequestSchema.safeParse(filter);
        if (!validation.success) {
            console.error("Erro de validação dos dados de requisição", validation.error);
            return { success: false, error: message };
        }

        const response = await api.post(`/api/events/filter?page=${page}&size=10`, validation.data);

        const parsed = PaginatedEventsSchema.safeParse(response.data);
        if (parsed.success) {
            return {
                success: true,
                data: {
                    events: parsed.data.content,
                    totalPages: parsed.data.totalPages,
                },
            };
        } else {
            console.error("Erro de validação", parsed.error);
            return { success: false, error: message };
        }
    } catch (error) {
        console.error("Erro ao buscar os eventos", error);
        return { success: false, error: message };
    }
};