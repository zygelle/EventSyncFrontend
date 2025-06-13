import { Link, useNavigate } from "react-router-dom";
import { Input } from '../../components/forms/Input';
import React, { useState } from "react";

import api from "../../services/api/api.tsx";
import {pathLogin} from "../../routers/Paths.tsx";

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    async function register(e: React.FormEvent) {
        e.preventDefault();

        const data = {
            name,
            email,
            password,
        }

        try {
            const response = await api.post('api/auth/register', data);

            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            localStorage.setItem('accessToken', response.data.token);

            alert('Cadastro realizado com sucesso!');
            navigate(pathLogin);
        } catch (error) {
            setErrorMessage('Falha no cadastro, tente novamente: ' + error);
        }
    }


    return(
        <div className="flex w-full h-screen items-center justify-center flex-col bg-gradient-to-r from-black to-gray-700">
            <Link to="/">
                <h1 className="mt-11 text-white mb-7 font-bold text-5xl">Event
                    <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">Sync</span>
                </h1>
            </Link>

            <form onSubmit={register} className="w-full max-w-xl flex flex-col p-8 rounded-lg bg-white shadow-2xl">
                <label id="email-label" className="mb-2">Nome</label>
                <Input
                aria-labelledby="nome-label"
                placeholder="Insira seu nome"
                type="name"
                value={name}
                onChange={ (e) => setName(e.target.value) }
                />

                <label id="email-label" className="mb-2">Email</label>
                <Input
                aria-labelledby="email-label"
                placeholder="Insira seu email"
                type="email"
                value={email}
                onChange={ (e) => setEmail(e.target.value) }
                />

                <label id="senha" className="mb-2">Senha</label>
                <Input
                aria-labelledby="senha"
                placeholder="Insira sua senha"
                type="password"
                value={password}
                onChange={ (e) => setPassword(e.target.value) }
                />
                {errorMessage && (<span className="text-red-600 mb-4">{errorMessage}</span>)}

                <button 
                type="submit"
                className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white">
                    Cadastrar
                </button>
            </form>
        </div>
    )
}