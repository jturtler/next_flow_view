export const getStatusName = (status: string): string => {
    const str = status.split("_").join(" ");
    return str.charAt(0).toUpperCase() + str.slice(1);
}