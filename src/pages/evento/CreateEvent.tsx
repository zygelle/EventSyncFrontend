import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api/api.tsx';
import { zodResolver } from "@hookform/resolvers/zod";
import { pathHome, setPathViewEvent } from "../../routers/Paths.tsx";
import { EventDetailSchema } from "../../schemas/EventSchema.tsx";
import { useForm } from "react-hook-form";
import { type createEvent, createEventSchema} from "../../schemas/CreateEventSchema.tsx";
import { loadCategories } from "../../utils/loadCategories.tsx";
import { type Category } from "../../schemas/EventSchema.tsx";
import Select from "react-select";

export function CreateEvent(){
    const navigate = useNavigate();
    const [isEnable, setEnable] = useState<boolean>(false);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
    const categorySelectOptions = categoryOptions.map(category => ({
        value: category.id,
        label: category.name
    }));
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<createEvent>({
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
            console.error("Erro ao buscar categorias: ", error)
        })
    }, []);

    async function saveDatabase(e:createEvent) {
        const result = createEventSchema.safeParse(e);
        if (!result.success) {
            console.log(result.error);
            return;
        }
        try {
            const response = await api.post('api/events', e);
            const data = EventDetailSchema.safeParse(response.data);
            if(data.success) {
                navigate(setPathViewEvent(data.data.id));
            } else {
                console.log("Erro ao validar resposta do servidor.");
                navigate(pathHome);
            }
            
        } catch (error) {
            alert("Erro ao criar evento");
            console.error("Erro ao criar evento: ", error)
        }
    }

    async function criar(e: createEvent) {
        try {
            setEnable(true);

            saveDatabase(e).catch((error) => {
                console.error("Erro ao salvar evento: " + error)
            });
        } catch (error) {
            console.error("Erro ao criar evento: ", error);
        }
    }

    return (
        <main>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full flex flex-col p-2 rounded-lg shadow-2x">
                    <div className="gap-2.5 mt-2 max-w-full">
                        <form onSubmit={handleSubmit(criar)} className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                <div>
                                    <label id="name" className="mb-2">Nome do Evento</label>
                                    <input
                                        {...register("name")}
                                        aria-labelledby="name"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                        placeholder="Nome do Evento"
                                    />
                                    {errors.name && <span className="text-red-600">{errors.name.message}</span>}
                                </div>
                                <div>
                                    <label id="description" className="mb-2">Descrição do Evento</label>
                                    <input
                                        {...register("description")}
                                        aria-labelledby="description"
                                        placeholder="Descrição do Evento"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.description && <span className='text-red-600'>{errors.description.message}</span>}
                                </div>
                                <div>
                                    <label id="location" className="mb-2">Local do Evento</label>
                                    <input
                                        {...register("location")}
                                        aria-labelledby="location"
                                        placeholder="Local do Evento"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.location && <span className='text-red-600'>{errors.location.message}</span>}
                                </div>
                                <div>
                                    <label id="date" className="mb-2">Data do Evento</label>
                                    <input
                                        {...register("date")}
                                        aria-labelledby="date"
                                        placeholder="Data do Evento"
                                        type="date"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.date && <span className='text-red-600'>{errors.date.message}</span>}
                                </div>
                                <div>
                                    <label id="start-time" className="mb-2">Horário de Início</label>
                                    <input
                                        {...register("startTime")}
                                        aria-labelledby="start-time"
                                        placeholder="HH:MM"
                                        type="time"
                                        className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    />
                                    {errors.startTime && <span className='text-red-600'>{errors.startTime.message}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                <div>
                                    <label id="end-time" className="mb-2">Horário de Fim</label>
                                    <input
                                        {...register("endTime")}
                                        aria-labelledby="end-time"
                                        placeholder="HH:MM"
                                        type="time"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.endTime && <span className='text-red-600'>{errors.endTime.message}</span>}
                                </div>
                                <div>
                                    <label id="event-type" className="mb-2">Tipo do Evento</label>
                                    <input
                                        {...register("eventType")}
                                        aria-labelledby="event-type"
                                        placeholder="Tipo do Evento"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.eventType && <span className='text-red-600'>{errors.eventType.message}</span>}
                                </div>
                                <div>
                                    <label id="ticket-url" className="mb-2">Site para compra</label>
                                    <input
                                        {...register("ticketUrl")}
                                        aria-labelledby="event-type"
                                        placeholder="Site para compra do ingresso"
                                        className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    />
                                    {errors.ticketUrl && <span className='text-red-600'>{errors.ticketUrl.message}</span>}
                                </div>
                                <div>
                                    <label id="official-site-url" className="mb-2">Site oficial do Evento</label>
                                    <input
                                        {...register("officialSiteUrl")}
                                        aria-labelledby="event-type"
                                        placeholder="Site oficial do Evento"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.officialSiteUrl && <span className='text-red-600'>{errors.officialSiteUrl.message}</span>}
                                </div>
                                <div>
                                    <label id="online-url" className="mb-2">Link para o Evento</label>
                                    <input
                                        {...register("onlineUrl")}
                                        aria-labelledby="event-type"
                                        placeholder="Link para o Evento (se aplicável)"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                    />
                                    {errors.onlineUrl && <span className='text-red-600'>{errors.onlineUrl.message}</span>}
                                </div>
                                <div>
                                    <label id="online-url" className="mb-2">Categoria do Evento</label>
                                    <Select
                                        {...register("categoryId")}
                                        aria-labelledby="categories"
                                        options={categorySelectOptions}
                                        value={categorySelectOptions.find(option => option.value === watchedCategoryId) || undefined}
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
                                    onClick={() => {navigate(pathHome)}}
                                    type="reset"
                                    className="h-9 hover:bg-slate-200 rounded border-slate-200 border-2 text-lg px-4">
                                    Cancelar
                                </button>
                                <button
                                    disabled={isEnable}
                                    type="submit"
                                    className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white px-4">
                                    Criar Evento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
