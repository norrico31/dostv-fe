export function transformBeToFe<T>(data: DaoBE<T>): DAOReturnedType<T> {
    return {
        data: data.data,
        page: data.current_page,
        totalItems: data.total_items,
        lastPage: data.last_page
    }
}