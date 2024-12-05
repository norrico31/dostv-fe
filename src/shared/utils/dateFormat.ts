const months: Record<string, string> = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'Aug',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

export const formatDate = (d: Date) => {
    if (!d) return undefined
    const date = new Date(d);

    // Extract the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns a zero-based index
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // Format the date as mm-dd-yyyy
    return `${months[month]}-${day}-${year}`;

}