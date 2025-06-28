
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
        return '';
    }

    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };

    return date.toLocaleDateString('pt-BR', options);
};

export const formatTime = (time: string) => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Date(`1970-01-01T${time}`).toLocaleTimeString('pt-BR', options);
};
