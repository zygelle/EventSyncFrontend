import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { type EventDetail, EventDetailSchema } from "../../schemas/EventSchema.tsx";
import api from "../../services/api/api.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { pathEvents, pathHome } from "../../routers/Paths.tsx";
import { formatDate } from "../../utils/formatDate.tsx";

function ViewEvent() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchEvent() {
            if (!id) {
                setError("ID do evento não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const eventResponse = await api.get(`/api/events/${id}`);
                const eventResult = EventDetailSchema.safeParse(eventResponse.data);

                if (eventResult.success) {
                    setEvent(eventResult.data);
                } else {
                    console.error("Erro de validação do evento:", eventResult.error);
                    setError("Dados do evento inválidos.");
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Erro ao carregar o evento:", err);
                setError("Não foi possível carregar o evento.");
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <main className="flex justify-center items-center h-screen">
                <div className="border-4 border-t-4 border-gray-200 border-solid w-16 h-16 rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-700">Carregando evento...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex flex-col justify-center items-center h-screen">
                <p className="text-red-600 text-lg">{error}</p>
                <button
                    onClick={() => navigate(pathHome)}
                    className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
                >
                    Voltar para a Página Inicial
                </button>
            </main>
        );
    }

    if (!event) { 
        return (
            <main className="flex flex-col justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Evento não encontrado.</p>
                <button
                    onClick={() => navigate(pathHome)}
                    className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
                >
                    Voltar para a Página Inicial
                </button>
            </main>
        );
    }

    return (
        <main>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-gray-700">
                            <strong className="text-gray-800">Data:</strong> {formatDate(event.date || "")}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-700">
                        <strong className="text-gray-800">Organizador:</strong> {event.organizer.name}
                    </p>
                </div>

                {event.category && (
                    <div className="flex items-center text-sm mb-4">
                        <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                            <FontAwesomeIcon icon={faTag} className="mr-2" /> {event.category.name}
                        </span>
                    </div>
                )}

                <div className="text-center mt-6 flex justify-center gap-4">
                    <button
                        onClick={() => navigate(pathEvents)}
                        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Voltar para a lista de Eventos
                    </button>
                </div>
            </div>
        </main>
    );
}

export default ViewEvent;