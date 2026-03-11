const API_URL = "http://localhost/BookListApp/public";

export const getBooks = async () => {
    const response = await fetch(`${API_URL}/books`);
    return response.json();
};

export const getTopBooksDesc = async () => {
    const response = await fetch(`${API_URL}/books?sort=rating&order=desc`);
    return response.json();
};