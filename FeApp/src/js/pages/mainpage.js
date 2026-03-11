import { renderNavbar } from "../components/navbar.js";
import { renderBookCard } from "../components/bookCard.js";
import { renderBookList, enableBookSorting } from "../components/bookList.js";

import { getBooks } from "../api.js";
import { goToBookDetail } from "../app.js";

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
    getBooks("rating", "desc").then(books => {
        const topBooksDiv = document.getElementById("top-books");
        // Take only top 3
        const top3 = books.slice(0, 3);

        top3.forEach(book => {
            topBooksDiv.innerHTML += renderBookCard(book);
        });

        // Click listener - goToBookDetail
        topBooksDiv.querySelectorAll(".book-card__img").forEach(img => {
            img.addEventListener("click", () => {
                const id = img.dataset.id;
                goToBookDetail(id);
            });
        });
    });

    // Initial states
    let initialSort = "title";
    let initialOrder = "desc";
    // Fetch books
    getBooks(initialSort, initialOrder).then(books => {

        const bookListDiv = document.getElementById("book-list");

        bookListDiv.innerHTML = renderBookList(books, initialSort, initialOrder);
        enableBookSorting();

        // Click listener - goToBookDetail
        bookListDiv.querySelectorAll(".book-row").forEach(row => {
            row.addEventListener("click", () => {
                const id = row.dataset.id;
                goToBookDetail(id);
            });
        });

    });
    
}