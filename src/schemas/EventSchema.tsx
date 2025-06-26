import { z } from "zod";

export const FilterRequestSchema = z.object({
    name: z.string().optional(),
    date: z.string().nullable().optional(),
    categoryName: z.array(z.string()).optional().nullable(),
});

export type FilterRequest = z.infer<typeof FilterRequestSchema>;

export const CategorySchema = z.object({
    id: z.string().uuid("ID da categoria inválido."),
    name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const OrganizerSchema = z.object({
    email: z.string(),
    name: z.string(),
});

export type Organizer = z.infer<typeof OrganizerSchema>;

export const EventSummarySchema = z.object({
    id: z.string().uuid("ID do evento inválido."),
    name: z.string(),
    date: z.string(),
    startTime: z.string(),
    location: z.string().nullable(),
    categoryName: z.string().nullable(),
});

export type EventSummary = z.infer<typeof EventSummarySchema>;

export const HATEOASSchema = z.object({
    self: z.object({
        href: z.string()
    }).optional(),
    "all-events": z.object({
        href: z.string()
    }).optional(),
    update: z.object({
        href: z.string()
    }).optional(),
    "uncheck-in": z.object({
        href: z.string()
    }).optional(),
    "check-in": z.object({
        href: z.string()
    }).optional(),
    delete: z.object({
        href: z.string()
    }).optional()
});

export type HATEOAS = z.infer<typeof HATEOASSchema>;

export const EventDetailSchema = z.object({
    id: z.string().uuid("ID do evento inválido."),
    name: z.string().min(1, "O nome não pode estar em branco."),
    description: z.string().min(1, "A descrição não pode estar em branco."),
    location: z.string().nullable(),
    date: z.string().refine((val) => {
        const eventDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate > today;
    }, "A data deve ser no futuro ou no dia atual."),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    eventType: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO'], {
        errorMap: () => ({ message: "Tipo de evento inválido." })
    }),
    ticketUrl: z.string().url("URL do ingresso inválida.").or(z.literal('')).nullable(),
    officialSiteUrl: z.string().url("URL do site oficial inválida.").or(z.literal('')).nullable(),
    onlineUrl: z.string().url("URL online inválida.").or(z.literal('')).nullable(),
    category: CategorySchema.nullable(),
    organizer: OrganizerSchema,
    userIsCheckedIn: z.boolean().optional(),
    _links: HATEOASSchema
});

export type EventDetail = z.infer<typeof EventDetailSchema>;

export const CollectionModelSchema = z.object({
    _embedded: z.object({
        eventSummaryResponseDTOList: z.array(EventSummarySchema)
    }).optional(),
    _links: z.object({
        self: z.object({
            href: z.string()
        }).optional()
    }).optional()
});

