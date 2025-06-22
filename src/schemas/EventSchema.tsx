import {z} from "zod";

export const FilterRequestSchema = z.object({
    name: z.string().optional(),
    date: z.string().nullable().optional(),
    categoryName: z.array(z.string()).optional().nullable(),
});

export type FilterRequest = z.infer<typeof FilterRequestSchema>;

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>

export const EventSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    date: z.string().nullable().optional(),
    categoryName: z.array(z.string()).optional().nullable(),
});

export type Event = z.infer<typeof EventSchema>;

export const PaginatedEventsSchema = z.object({
    content: z.array(EventSchema),
    pageable: z.object({
        pageNumber: z.number(),
        pageSize: z.number(),
    }),
    totalElements: z.number(),
    totalPages: z.number(),
    numberOfElements: z.number(),
});