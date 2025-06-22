import { useEffect, useState } from "react";
import { type Category, type FilterRequest, FilterRequestSchema } from "../schemas/EventSchema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { loadCategories } from "../utils/loadCategories.tsx";

interface FilterOffcanvasProps {
    onApplyFilters: (filter: FilterRequest) => void;
    onClose: () => void;
    isOpen: boolean;
    currentFilters: FilterRequest;
}

const FilterOffcanvas: React.FC<FilterOffcanvasProps> = ({ onApplyFilters, onClose, isOpen, currentFilters}) => {

    const { register, handleSubmit, formState: { errors }, setValue,  watch} = useForm<FilterRequest>({
        resolver: zodResolver(FilterRequestSchema),
        defaultValues: {
            name: "",
            date: "",
            categoryName: [],
        }
    });

    useEffect(() => {
        if (isOpen && currentFilters) {
            setValue("name", currentFilters.name);
            setValue("date", currentFilters.date);
            setValue("categoryName", currentFilters.categoryName || []);
        }
    }, [isOpen, currentFilters, setValue]);

    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

    const categorySelectOptions = categoryOptions.map(category => ({
        value: category.id,
        label: category.name
    }));

    useEffect(() => {
        loadCategories(setCategoryOptions).catch((error) => {
            console.error("Erro ao buscar categorias: ", error)
        })
    }, [isOpen]);

    const handleApplyFilters = (data: FilterRequest) => {
        onApplyFilters(data);
        onClose();
    };

    return (
        <div
            className={`fixed top-0 right-0 w-96 h-screen bg-white shadow-lg transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ overflowY: 'auto' }}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">Filtros</h3>
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Fechar"
                >
                    <FontAwesomeIcon icon={faXmark} className="w-6 h-6"/>
                </button>

            </div>

            <form onSubmit={handleSubmit(handleApplyFilters)} className="p-5 space-y-4">
                <div>
                    <label htmlFor="name-input" className="block text-sm font-medium text-gray-700">Nome do evento</label>
                    <input
                        id="name-input"
                        {...register("name")}
                        type="text"
                        className="border border-slate-300 h-9 rounded-md outline-none p-2 w-full"
                        placeholder="Digite o nome do evento"
                    />
                    {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                </div>
                <div>
                    <label htmlFor="date-input" className="block text-sm font-medium text-gray-700">Data do evento</label>
                    <input
                        id="date-input"
                        {...register("date")}
                        type="text"
                        className="border border-slate-300 h-9 rounded-md outline-none p-2 w-full"
                        placeholder="Digite a data do evento"
                    />
                    {errors.date && <span className="text-red-500">{errors.date.message}</span>}
                </div>

                <div>
                    <label htmlFor="category-select" className="block text-sm font-medium text-gray-700">Categoria do evento</label>
                    <Select
                        id="category-select"
                        {...register("categoryName")}
                        options={categorySelectOptions}
                        isMulti
                        value={categorySelectOptions.filter(option =>
                            watch("categoryName")?.includes(option.value)
                        )}
                        onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions.map(option => option.value);
                            setValue("categoryName", selectedValues, { shouldValidate: true });
                        }}
                        className="input"
                        placeholder="Selecione as categorias"
                    />
                    {errors.categoryName && <span className="text-red-500">{errors.categoryName.message}</span>}
                </div>
            </form>
        </div>
    );
};

export default FilterOffcanvas;