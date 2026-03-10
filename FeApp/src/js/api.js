const API_URL = "http://localhost/BookListApp/public";

export const getBooks = async () => {
    const response = await fetch(`${API_URL}/books`);
    return response.json();
};