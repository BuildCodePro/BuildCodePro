export const formatDate = (
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options,
    });
};