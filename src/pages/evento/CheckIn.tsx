import { useEffect, useRef, useState } from "react";
import { type EventSummary, CollectionModelSchema } from "../../schemas/EventSchema.tsx";
import EventCardsOptional from "../../components/cards/EventCards.tsx";
import api from "../../services/api/api.tsx";

const EventList: React.FC = () => {
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    const loadEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/me/events`);
            const parsed = CollectionModelSchema.safeParse(response.data);

            if (parsed.success) {
                setEvents(parsed.data._embedded?.eventSummaryResponseDTOList || []);
            } else {
                console.error("Erro de validação do schema do CollectionModel:", parsed.error);
                setError("Ocorreu um erro ao processar os dados dos eventos.");
            }
        } catch (err) {
            console.error("Erro inesperado ao carregar os eventos:", err);
            setError("Ocorreu um erro ao buscar os eventos. Verifique sua conexão.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    return (
        <main>
            <div className="flex justify-between mb-4">
                <h1 ref={topRef} className="text-3xl font-semibold text-gray-900">Eventos</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="border-4 border-t-4 border-gray-200 border-solid w-12 h-12 rounded-full animate-spin"></div>
                    <p className="ml-4 text-gray-700">Carregando eventos...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center mt-8">
                    <p className="text-red-600 text-lg">{error}</p>
                </div>
            ) : events.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                    {events.map((event) => (
                        <EventCardsOptional key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center mt-24">
                    <p className="text-gray-500 text-lg">Nenhum evento encontrado no momento!</p>
                </div>
            )}
        </main>
    );
}

export default EventList;