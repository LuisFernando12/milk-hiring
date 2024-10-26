export default (date) => {
    const isoRegex = (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    const dateRegex = (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    if (!isoRegex.test(date) && !dateRegex.test(date)) {
        throw new Error('Invalid date format, use yyyy-mm-dd hh:mm:ss or yyyy-mm-ddThh:mm:ss.ms');
    }
    const newDate = new Date(date);

    return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'America/Sao_Paulo',
    }).format(newDate);

}