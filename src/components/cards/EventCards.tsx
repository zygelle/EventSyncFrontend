import type { Event } from "../../schemas/EventSchema.tsx";
import { useNavigate } from "react-router-dom";
import { setPathVisualizarEvento } from "../../routers/Paths.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { formatDateSimple } from "../../utils/formatDateSimple.tsx";

interface OptionEventCardsProps {
    event: Event;
}

const EventCardsOptional: React.FC<OptionEventCardsProps> = ({ event }) => {
    const navigate = useNavigate();

    function handleNavigate(){
        navigate(setPathVisualizarEvento(event.id))
    }

    return (
        <div className="w-full grid grid-cols-1 gap-2 place-content-center border-solid border-2 p-4 border-gray-300 rounded-3xl
                        md:grid-cols-3 hover:border-blue-500 hover:cursor-pointer hover:shadow-blue-100 hover:shadow-md
        " onClick={handleNavigate}>
            <div className="grid grid-cols-2 col-span-2 md:order-2">
                <div>{event.name}</div>
                <div className="text-end text-sm">{formatDateSimple(event.date || '')}</div>
            </div>
            <div className="grid grid-cols-2 col-span-2 md:order-2">
                <div className="text-start text-xs hover:cursor-pointer">
                    {event.categoryName && event.categoryName.length > 1 ? (
                        <div className="relative group">
                            <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                                <FontAwesomeIcon icon={faTag} /> {event.categoryName[0]}
                            </span>
                            <span className="ml-2 font-bold">...</span>
                            <div
                                className="text-center absolute hidden group-hover:block bg-white border
                                border-gray-200 shadow-lg mt-1 rounded-lg p-2 w-fit">
                                <ul>
                                    {event.categoryName.slice(1).map((categoryName, index) => (
                                        <div key={index} className="py-1">
                                            <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                                            <FontAwesomeIcon icon={faTag} /> {categoryName}
                                            </span>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                            <FontAwesomeIcon icon={faTag} /> {event.categoryName?.[0]}
                        </span>
                    )}
                </div>
            </div>
        </div>

    );
};

export default EventCardsOptional;