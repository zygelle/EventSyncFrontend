import {z} from "zod";

export const createEventSchema = z.object({
    name: z.string().min(1, "O nome não pode estar em branco."),
    description: z.string().min(1, "A descrição não pode estar em branco."),
    location: z.string().optional(),
    date: z.string().refine((val) => {
        const eventDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate > today;
    }, "A data deve ser no futuro."),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    eventType: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO'], {
        errorMap: () => ({ message: "Tipo de evento inválido." })
    }),
    ticketUrl: z.string().url("URL do ingresso inválida.").optional().or(z.literal('')),
    officialSiteUrl: z.string().url("URL do site oficial inválida.").optional().or(z.literal('')),
    onlineUrl: z.string().url("URL online inválida.").optional().or(z.literal('')),
    categoryId: z.string().uuid("ID da categoria inválido.").optional().or(z.literal(''))
});

export type createEvent = z.infer<typeof createEventSchema>;