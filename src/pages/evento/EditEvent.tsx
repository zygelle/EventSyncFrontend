import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../../services/api/api.tsx';
import { zodResolver } from "@hookform/resolvers/zod";
import { pathHome, setPathViewEvent } from "../../routers/Paths.tsx";
import { EventDetailSchema, type Category } from "../../schemas/EventSchema.tsx";
import { useForm } from "react-hook-form";
import { type createEvent, createEventSchema } from "../../schemas/CreateEventSchema.tsx";
import { loadCategories } from "../../utils/loadCategories.tsx";
import Select from "react-select";
import { formatDateISO } from "../../utils/formatDateSimple.tsx";

export function EditEvent() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

    const categorySelectOptions = categoryOptions.map(category => ({
        value: category.id,
        label: category.name
    }));

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<createEvent>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            date: "",
            startTime: "",
            endTime: "",
            eventType: "PRESENCIAL",
            ticketUrl: "",
            officialSiteUrl: "",
            onlineUrl: "",
            categoryId: undefined,
        },
    });

    const watchedCategoryId = watch("categoryId");

    useEffect(() => {
        loadCategories(setCategoryOptions).catch((error) => {
            console.error("Erro ao buscar categorias: ", error);
        });
    }, []);

    useEffect(() => {
        if (!id) {
            setFetchError("ID do evento não fornecido para edição.");
            setLoadingEvent(false);
            return;
        }

        async function fetchEventDetails() {
            setLoadingEvent(true);
            setFetchError(null);
            try {
                const response = await api.get(`/api/events/${id}`);
                const result = EventDetailSchema.safeParse(response.data);

                if (result.success) {
                    const eventData = result.data;
                    reset({
                        name: eventData.name,
                        description: eventData.description,
                        location: eventData.location || "",
                        date: eventData.date ? formatDateISO(eventData.date) : "",
                        startTime: eventData.startTime ? eventData.startTime.substring(0, 5) : "",
                        endTime: eventData.endTime ? eventData.endTime.substring(0, 5) : "",
                        eventType: eventData.eventType,
                        ticketUrl: eventData.ticketUrl || "",
                        officialSiteUrl: eventData.officialSiteUrl || "",
                        onlineUrl: eventData.onlineUrl || "",
                        categoryId: eventData.category ? eventData.category.id : undefined,
                    });
                } else {
                    console.error("Erro de validação dos dados do evento ao carregar:", result.error);
                    setFetchError("Erro ao processar os dados do evento.");
                }
            } catch (err) {
                console.error("Erro ao carregar o evento para edição:", err);
                setFetchError("Não foi possível carregar o evento para edição.");
            } finally {
                setLoadingEvent(false);
            }
        }

        fetchEventDetails();
    }, [id, reset]);

    async function handleSaveEvent(data: createEvent) {
        setSubmitting(true);
        try {
            const response = await api.put(`/api/events/${id}`, data);
            const result = EventDetailSchema.safeParse(response.data);

            if (result.success) {
                alert("Evento atualizado com sucesso!");
                navigate(setPathViewEvent(result.data.id));
            } else {
                console.error("Erro ao validar resposta do servidor após atualização:", result.error);
                alert("Erro ao validar os dados retornados pelo servidor.");
                navigate(pathHome);
            }

        } catch (error) {
            alert("Erro ao atualizar evento. Por favor, tente novamente.");
            console.error("Erro ao atualizar evento: ", error);
        } finally {
            setSubmitting(false);
        }
    }

    if (loadingEvent) {
        return (
            <main className="flex justify-center items-center h-screen">
                <div className="border-4 border-t-4 border-gray-200 border-solid w-16 h-16 rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-700">Carregando evento para edição...</p>
            </main>
        );
    }

    if (fetchError) {
        return (
            <main className="flex flex-col justify-center items-center h-screen">
                <p className="text-red-600 text-lg">{fetchError}</p>
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
            <div className="flex flex-col items-center justify-center">
                <div className="w-full flex flex-col p-2 rounded-lg shadow-2xl">
                    <div className="gap-2.5 mt-2 max-w-full">
                        <form onSubmit={handleSubmit(handleSaveEvent)} className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                <div>
                                    <label htmlFor="name" className="mb-2">Nome do Evento</label>
                                    <input
                                        id="name"
                                        {...register("name")}
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                        placeholder="Nome do Evento"
                                    />
                                    {errors.name && <span className="text-red-600">{errors.name.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="description" className="mb-2">Descrição do Evento</label>
                                    <input
                                        id="description"
                                        {...register("description")}
                                        placeholder="Descrição do Evento"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.description && <span className='text-red-600'>{errors.description.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="location" className="mb-2">Local do Evento</label>
                                    <input
                                        id="location"
                                        {...register("location")}
                                        placeholder="Local do Evento"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.location && <span className='text-red-600'>{errors.location.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="date" className="mb-2">Data do Evento</label>
                                    <input
                                        id="date"
                                        {...register("date")}
                                        placeholder="Data do Evento"
                                        type="date"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.date && <span className='text-red-600'>{errors.date.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="start-time" className="mb-2">Horário de Início</label>
                                    <input
                                        id="start-time"
                                        {...register("startTime")}
                                        placeholder="HH:MM"
                                        type="time"
                                        className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    />
                                    {errors.startTime && <span className='text-red-600'>{errors.startTime.message}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                <div>
                                    <label htmlFor="end-time" className="mb-2">Horário de Fim</label>
                                    <input
                                        id="end-time"
                                        {...register("endTime")}
                                        placeholder="HH:MM"
                                        type="time"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.endTime && <span className='text-red-600'>{errors.endTime.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="event-type" className="mb-2">Tipo do Evento</label>
                                    <select
                                        id="event-type"
                                        {...register("eventType")}
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    >
                                        <option value="PRESENCIAL">PRESENCIAL</option>
                                        <option value="ONLINE">ONLINE</option>
                                        <option value="HIBRIDO">HÍBRIDO</option>
                                    </select>
                                    {errors.eventType && <span className='text-red-600'>{errors.eventType.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="ticket-url" className="mb-2">Site para compra</label>
                                    <input
                                        id="ticket-url"
                                        {...register("ticketUrl")}
                                        placeholder="Site para compra do ingresso"
                                        className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    />
                                    {errors.ticketUrl && <span className='text-red-600'>{errors.ticketUrl.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="official-site-url" className="mb-2">Site oficial do Evento</label>
                                    <input
                                        id="official-site-url"
                                        {...register("officialSiteUrl")}
                                        placeholder="Site oficial do Evento"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.officialSiteUrl && <span className='text-red-600'>{errors.officialSiteUrl.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="online-url" className="mb-2">Link para o Evento</label>
                                    <input
                                        id="online-url"
                                        {...register("onlineUrl")}
                                        placeholder="Link para o Evento (se aplicável)"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.onlineUrl && <span className='text-red-600'>{errors.onlineUrl.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="category-select" className="mb-2">Categoria do Evento</label>
                                    <Select
                                        id="category-select"
                                        options={categorySelectOptions}
                                        value={categorySelectOptions.find(option => option.value === watchedCategoryId) || null} // Use null instead of undefined for react-select
                                        onChange={(selectedOption) => {
                                            setValue("categoryId", selectedOption ? selectedOption.value : undefined, { shouldValidate: true });
                                        }}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Selecione uma categoria"
                                        isClearable
                                        isSearchable
                                    />
                                    {errors.categoryId && <span className='text-red-600'>{errors.categoryId.message}</span>}
                                </div>
                            </div>
                            <div className="col-span-2 flex justify-center gap-4">
                                <button
                                    onClick={() => { navigate(pathHome) }}
                                    type="reset"
                                    className="h-9 hover:bg-slate-200 rounded border-slate-200 border-2 text-lg px-4">
                                    Cancelar
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white px-4">
                                    {submitting ? "Salvando..." : "Salvar Alterações"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}