import { renderNavbar } from "../components/navbar.js";
import { renderBookCard } from "../components/bookCard.js";
import { renderBookList, enableBookSorting } from "../components/bookList.js";

import { getBooks , deleteBook, importBooks} from "../api.js";
import { goToBookDetail, goToBookForm } from "../app.js";

import { isAdmin } from "../utils/admin.js";

export function renderMainPage() {
    // Render navbar first
    renderNavbar();

    // Main page container
    const mainpage = document.getElementById("mainpage");
    // User is admin -> Load only bookList + iimportBooks button
    if (isAdmin()) {
        mainpage.innerHTML = `
            <div class="book-list-wrapper">

                <div class="admin-actions">
                    <button id="import-books-btn">Import Books</button>
                    <input type="file" id="import-file-input" accept=".json" style="display:none" />
                </div>

                <div id="book-list"></div>

            </div>
        `;
        const importBtn = document.getElementById("import-books-btn");
        const fileInput = document.getElementById("import-file-input");

        importBtn.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", async (e) => {

            const file = e.target.files[0];
            if (!file) return;

            try {

                const text = await file.text();
                const json = JSON.parse(text);

                await importBooks(json);

                alert("Books imported successfully!");
                location.reload();

            } catch (err) {

                console.error(err);
                alert("Invalid JSON or import failed");

            }

        });
        
    } else {
        mainpage.innerHTML = `
            <div id="top-books" class="top-books"></div>
            <div id="book-list"></div>
        `;
    }

    // Fetch topBooks (if not admin)
    if (!isAdmin()) {
        getBooks("rating", "desc").then(books => {
            const topBooksDiv = document.getElementById("top-books");
            const top3 = books.slice(0, 3);

            top3.forEach(book => {
                topBooksDiv.innerHTML += renderBookCard(book);
            });

            // TopBooks img click - open bookDetail
            topBooksDiv.querySelectorAll(".book-card__img").forEach(img => {
                img.addEventListener("click", () => {
                    const id = img.dataset.id;
                    goToBookDetail(id);
                });
            });
        });
    }

    // Initial states
    let initialSort = "title";
    let initialOrder = "desc";

    // Fetch books
    getBooks(initialSort, initialOrder).then(books => {
        const bookListDiv = document.getElementById("book-list");

        bookListDiv.innerHTML = renderBookList(books, initialSort, initialOrder);
        enableBookSorting();

        // Click listener - goToBookDetail (all rows except options)
        bookListDiv.querySelectorAll(".book-row").forEach(row => {
            row.addEventListener("click", () => {
                const id = row.dataset.id;
                goToBookDetail(id);
            });
        });

        // Handle edit/delete icons (stop row click propagation)
        bookListDiv.querySelectorAll(".option-icon").forEach(icon => {
            icon.addEventListener("click", async e => {
                e.stopPropagation(); // prevent row click

                const id = icon.dataset.id;
                if (icon.classList.contains("edit-icon")) {
                    goToBookForm(id);
                } else if (icon.classList.contains("delete-icon")) {
                    if (!confirm("Are you sure you want to delete this book?")) return;

                    try {
                        await deleteBook(id);
                        alert("Book deleted successfully!");
                        // Remove from DOM
                        const row = icon.closest(".book-row");
                        if (row) row.remove();
                    } catch (err) {
                        console.error(err);
                        alert("Failed to delete book.");
                    }
                }
            });
        });

        // Handle Create New Book button (last row)
        const createRow = bookListDiv.querySelector(".create-book-row");
        if (createRow) {
            createRow.addEventListener("click", () => {
                goToBookForm();
            });
        }
    });
}