const API_URL = "http://localhost/BookListApp/public";

// BE call, GET books (get allBooks basic info)
export const getBooks = async (sort = "title", order = "asc") => {
    const response = await fetch(`${API_URL}/books?sort=${sort}&order=${order}`);
    return response.json();
};

// BE call, GET book (get book full info)
export const getBook = async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`);
    return response.json();
};

// BE call, POST books (import books from JSON)
export const importBooks = async (booksJson) => {

    const response = await fetch(`${API_URL}/books/import`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booksJson)
    });

    if (!response.ok) {
        throw new Error("Failed to import books");
    }

    return response.json();
};

// BE call, POST book (create new book)
export const addBook = async (formData) => {

    const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        body: formData
    });

    return response.json();
};

// BE call, POST book (edit existing book)
export const updateBook = async (id, formData) => {

    const response = await fetch(`${API_URL}/books/${id}`, {
        method: "POST",
        body: formData
    });

    return response.json();
};

// BE call, DELETE book (delete existing book)
export const deleteBook = async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete book");
    }

    return await response.json();
};

// BE call, POST user (Admin login)
export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};


