
export const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };

    return new Date(date).toLocaleDateString('pt-BR', options);
};

export const formatTime = (time: string) => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Date(`1970-01-01T${time}`).toLocaleTimeString('pt-BR', options);
};
