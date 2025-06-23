import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().nonempty({ message: "O nome é obrigatório." }).min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    email: z.string().nonempty({ message: "O e-mail é obrigatório." }).email({ message: "Formato de e-mail inválido." }),
    password: z.string().nonempty({ message: "A senha é obrigatória." }).min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;