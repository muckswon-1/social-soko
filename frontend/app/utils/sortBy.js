/**
 * Sort an array by any key in ascending or descending order
 * @template T
 * @param {T[]} list
 * @param {(item: T) => any} selector - a function that returns the sortable value
 * @param {"asc" | "desc"} order
 * @returns {T[]}
 */
export const sortBy = (list, selector, order = "asc") => {
    const sorted  = [...list].sort((a, b) => {
        const aValue = selector(a);
        const bValue = selector(b);

        if(aValue < bValue) return order === "asc" ? -1 : 1;

        if(aValue > bValue) return order === "asc" ? 1 : -1;

        return 0;
    });

    return sorted
}



//Sort comments
export const sortCommentsByDate = (comments, order = "asc") => {
    return sortBy(comments, (c) => new Date(c.createdAt).getTime(), order )
}