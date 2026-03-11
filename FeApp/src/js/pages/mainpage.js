import { renderNavbar } from "../components/navbar.js";
import { renderBookCard } from "../components/bookCard.js";
import { renderBookList, enableBookSorting } from "../components/bookList.js";

import { getTopBooksDesc,getBooks } from "../api.js";

export function renderMainPage() {
    // Render navbar first
    renderNavbar();

    // Main page container
    const mainpage = document.getElementById("mainpage");
    mainpage.innerHTML = `
        <div id="top-books" class="top-books"></div>
        <div id="book-list"></div>
    `;
    // Fetch topBooks
    getTopBooksDesc().then(books => {
        const topBooksDiv = document.getElementById("top-books");
        // Take only top 3
        const top3 = books.slice(0, 3);

        top3.forEach(book => {
            topBooksDiv.innerHTML += renderBookCard(book);
        });
    });

    let initialSort = "title";
    let initialOrder = "desc";
    getBooks(initialSort, initialOrder).then(books => {

        const bookListDiv = document.getElementById("book-list");

        bookListDiv.innerHTML = renderBookList(books, initialSort, initialOrder);
        enableBookSorting();

    });
    
}