import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { type EventDetail, EventDetailSchema } from "../../schemas/EventSchema.tsx";
import api from "../../services/api/api.tsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faTrash, faEdit, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { pathHome, setPathEditEvent, pathEvents } from "../../routers/Paths.tsx";
import { formatDate, formatTime } from "../../utils/formatDateAndTime.tsx";
import { getEmail, isAuthenticated } from "../../services/authentication.tsx";

function ViewEvent() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [checkInButtonClass, setCheckInButtonClass] = useState<boolean>(false);

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
                    setCheckInButtonClass(eventResult.data.userIsCheckedIn || false);
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

    async function handleDelete() {
        if (!id) {
            alert("Não foi possível excluir o evento: ID não encontrado.");
            return;
        }
        if (window.confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
            try {
                const response = await api.delete(`/api/events/${id}`);
                if (response.status === 204 || response.status === 200) {
                    alert("Evento deletado com sucesso.");
                    navigate(pathHome);
                } else {
                    alert(`Erro ao deletar o evento: Status ${response.status}`);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 403) {
                        alert("Você não tem permissão para deletar este evento.");
                    } else if (error.response.status === 404) {
                        alert("Evento não encontrado para exclusão.");
                    } else {
                        alert("Erro ao deletar o evento. Por favor, tente novamente.");
                    }
                } else {
                    alert("Erro ao deletar o evento. Por favor, tente novamente.");
                }
            }
        }
    }

    function handleEdit() {
        if (id) {
            navigate(setPathEditEvent(id));
        } else {
            alert("Não foi possível editar o evento: ID não encontrado.");
        }
    }

    async function handleCheckIn() {
        if (!id) {
            alert("Não foi possível marcar presença: ID do evento não encontrado.");
            return;
        }

        if (event && !event.userIsCheckedIn) {
            try {
                const response = await api.post(`/api/events/${id}/checkin`);
                if (response.status === 204) {
                    alert("Presença marcada com sucesso!");
                    event.userIsCheckedIn = true;
                    setCheckInButtonClass(true);

                } else {
                    alert(`Erro ao marcar presença: Status ${response.status}`);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 403) {
                        alert("Você não tem permissão para marcar presença neste evento.");
                    } else if (error.response.status === 404) {
                        alert("Evento não encontrado para marcar presença.");
                    } else {
                        alert("Erro ao marcar presença. Por favor, tente novamente.");
                    }
                } else {
                    alert("Erro ao marcar presença. Por favor, tente novamente.");
                }
            }
        } else if (event && event.userIsCheckedIn) {
            try {
                const response = await api.delete(`/api/events/${id}/checkin`);
                if (response.status === 204) {
                    alert("Presença desmarcada com sucesso!");
                    event.userIsCheckedIn = false;
                    setCheckInButtonClass(false);
                } else {
                    alert(`Erro ao desmarcar presença: Status ${response.status}`);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 403) {
                        alert("Você não tem permissão para desmarcar presença neste evento.");
                    } else if (error.response.status === 404) {
                        alert("Evento não encontrado para desmarcar presença.");
                    } else {
                        alert("Erro ao desmarcar presença. Por favor, tente novamente.");
                    }
                } else {
                    alert("Erro ao desmarcar presença. Por favor, tente novamente.");
                }
            }
        }
    }

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
                {getEmail() === event.organizer.email && (
                    <div className="flex justify-end mb-3">
                    <button
                        onClick={handleEdit}
                        className="text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 mr-2" // Added mr-2 for spacing
                        title="Editar Evento"
                    >
                        <FontAwesomeIcon icon={faEdit} size="lg"/>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                        title="Deletar Evento"
                    >
                        <FontAwesomeIcon icon={faTrash} size="lg"/>
                    </button>
                </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-gray-700">
                            <strong className="text-gray-800">Data:</strong> {formatDate(event.date || "")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-gray-700">
                            <strong className="text-gray-800">Horário de Início:</strong> {formatTime(event.startTime || "00:00")}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700">
                            <strong className="text-gray-800">Horário de Término:</strong> {formatTime(event.endTime || "00:00")}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700">
                            <strong className="text-gray-800">Descrição:</strong> {event.description || "Não informado"}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700">
                            <strong className="text-gray-800">Localização:</strong> {event.location || "Não informado"}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700">
                            <strong className="text-gray-800">Site para compra:</strong> {event.ticketUrl || "Não informado"}
                        </p>
                    </div>
                    <div className="mb-4">
                    <p className="text-gray-700">
                        <strong className="text-gray-800">Organizador:</strong> {event.organizer.name}
                    </p>
                </div>
                </div>

                {event.category && (
                    <div className="flex items-center text-sm mb-4">
                        <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                            <FontAwesomeIcon icon={faTag} className="mr-2" /> {event.category.name}
                        </span>
                    </div>
                )}

                <div className="text-center mt-6 flex justify-center gap-4">
                    {isAuthenticated() && (
                    <button
                        onClick={handleCheckIn}
                        className={`px-6 py-2 rounded transition-colors duration-200 ${checkInButtonClass ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        {checkInButtonClass ? <span>Desmarcar Presença</span> : <span>Marcar presença</span>}
                    </button>
                    )}
                    <button
                        onClick={() => isAuthenticated() ? navigate(pathHome) : navigate(pathEvents)}
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