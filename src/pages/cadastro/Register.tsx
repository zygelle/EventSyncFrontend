import { Link, useNavigate } from "react-router-dom";
import { Input } from '../../components/forms/input/Input.tsx';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from '../../schemas/RegisterSchema.tsx';
import type { RegisterFormData } from '../../schemas/RegisterSchema.tsx';

import api from "../../services/api/api.tsx";
import {pathLogin} from "../../routers/Paths.tsx";

export function Register() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
            resolver: zodResolver(registerSchema)
        });

    async function regis(data: RegisterFormData) {
        try {
            const response = await api.post('api/auth/register', data);

            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('password', data.password);
            localStorage.setItem('accessToken', response.data.token);
            alert('Cadastro realizado com sucesso!');
            navigate(pathLogin);
        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
        }
    }


    return(
        <div className="flex w-full h-screen items-center justify-center flex-col bg-gradient-to-r from-black to-gray-700">
            <Link to="/">
                <h1 className="mt-11 text-white mb-7 font-bold text-5xl">Event
                    <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">Sync</span>
                </h1>
            </Link>

            <form onSubmit={handleSubmit(regis)} className="w-full max-w-xl flex flex-col p-8 rounded-lg bg-white shadow-2xl">
                <label id="name-label" className="mb-2">Nome</label>
                <Input
                aria-labelledby="name-label"
                placeholder="Insira seu nome"
                type="name"
                {...register("name")}
                />
                {errors.name && <span className="text-red-600 mb-4">{errors.name.message}</span>}

                <label id="email-label" className="mb-2">Email</label>
                <Input
                aria-labelledby="email-label"
                placeholder="Insira seu email"
                type="email"
                {...register("email")}
                />
                {errors.email && <span className="text-red-600 mb-4">{errors.email.message}</span>}

                <label id="senha" className="mb-2">Senha</label>
                <Input
                aria-labelledby="senha"
                placeholder="Insira sua senha"
                type="password"
                {...register("password")}
                />
                {errors.password && <span className="text-red-600 mb-4">{errors.password.message}</span>}

                <button 
                type="submit"
                className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white">
                    Cadastrar
                </button>
            </form>
        </div>
    )
}