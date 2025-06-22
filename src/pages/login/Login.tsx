import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from '../../schemas/LoginSchema.tsx';
import type { LoginFormData } from '../../schemas/LoginSchema.tsx';
import { Input } from '../../components/forms/input/Input.tsx';

import api from "../../services/api/api.tsx";
import { pathHome } from "../../routers/Paths.tsx";

export function Login() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    async function login(data: LoginFormData) {
        try {
            const response = await api.post('api/auth/login', data);

            if (response?.data?.token) {
                localStorage.setItem('email', data.email);
                localStorage.setItem('accessToken', response.data.token);
                navigate(pathHome);
            } else {
                console.error('Token not found in response:', response);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    }


    return(
        <div className="flex w-full h-screen items-center justify-center flex-col bg-gradient-to-r from-black to-gray-700">
            <Link to="/">
                <h1 className="mt-11 text-white mb-7 font-bold text-5xl">Event
                    <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">Sync</span>
                </h1>
            </Link>

            <form onSubmit={handleSubmit(login)} className="w-full max-w-xl flex flex-col p-8 rounded-lg bg-white shadow-2xl">
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
                    Entrar
                </button>
                <span className="mt-3">Ainda não possui cadastro? 
                    <Link to="/cadastro" className="text-blue-600 hover:text-blue-800 underline ml-1">
                    Cadastre-se aqui.
                    </Link>
                </span>
            </form>
        </div>
    )
}