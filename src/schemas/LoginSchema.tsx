import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().nonempty({ message: "O e-mail é obrigatório." }).email({ message: "Formato de e-mail inválido." }),
    password: z.string().nonempty({ message: "A senha é obrigatória." }).min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;