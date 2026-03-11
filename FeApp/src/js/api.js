const API_URL = "http://localhost/BookListApp/public";

export const getBooks = async (sort = "title", order = "asc") => {
    const response = await fetch(`${API_URL}/books?sort=${sort}&order=${order}`);
    return response.json();
};

export const getBook = async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`);
    return response.json();
};

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};
