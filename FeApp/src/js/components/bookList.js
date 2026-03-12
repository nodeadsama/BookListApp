import { renderRatingStars } from "./ratingStars.js";
import { getBooks } from "../api.js";

import { isAdmin } from "../utils/admin.js";

// Keep track of sort and order
let currentSort = "title";
let currentOrder = "desc";

export function renderBookList(books, sortColumn = currentSort, sortOrder = currentOrder) {

    let html = `
        <table class="book-table">
        <thead>
            <tr>
                <th>Obal</th>

                <th data-sort="title" class="${sortColumn === "title" ? "active-sort" : ""}">
                    <div class="th-content">
                        <span>Název</span>
                        ${sortColumn === "title" ? `<span class="sort-arrow">${sortOrder === "asc" ? "▲" : "▼"}</span>` : ""}
                    </div>
                </th>

                <th data-sort="author" class="${sortColumn === "author" ? "active-sort" : ""}">
                    <div class="th-content">
                        <span>Autor</span>
                        ${sortColumn === "author" ? `<span class="sort-arrow">${sortOrder === "asc" ? "▲" : "▼"}</span>` : ""}
                    </div>
                </th>

                <th data-sort="releaseDate" class="${sortColumn === "releaseDate" ? "active-sort" : ""}">
                    <div class="th-content">
                        <span>Datum vydání</span>
                        ${sortColumn === "releaseDate" ? `<span class="sort-arrow">${sortOrder === "asc" ? "▲" : "▼"}</span>` : ""}
                    </div>
                </th>

                <th data-sort="rating" class="${sortColumn === "rating" ? "active-sort" : ""}">
                    <div class="th-content">
                        <span>Hodnocení</span>
                        ${sortColumn === "rating" ? `<span class="sort-arrow">${sortOrder === "asc" ? "▲" : "▼"}</span>` : ""}
                    </div>
                </th>

                ${isAdmin() ? `<th>Options</th>` : ""}

            </tr>
        </thead>
        <tbody>
    `;

    books.forEach(book => {
        html += `
            <tr data-id="${book.id}" class="book-row">
                <td><img src="${book.imgPath}" class="book-table__img"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.release_date}</td>
                <td>${renderRatingStars(book.rating)}</td>

                <!-- User is admin -> +1 column (options)  -->
                ${isAdmin() ? 
                    `<td class="book-options">
                        <div class="options-wrapper">
                            <img src="images/editIcon.png" class="option-icon edit-icon" data-id="${book.id}">
                            <img src="images/deleteIcon.png" class="option-icon delete-icon" data-id="${book.id}">
                        </div>
                    </td>`
                : ""
                }
            </tr>
        `;
    });
    // User is admin -> +1 row (createBook button)
    if (isAdmin()) {
        html += `
            <tr class="create-book-row" data-action="create">
                <td colspan="6">+</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    `;

    return html;
}

export function enableBookSorting() {
    const bookListDiv = document.getElementById("book-list");
    if (!bookListDiv) return;

    const headers = bookListDiv.querySelectorAll(".book-table th[data-sort]");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const sortColumn = header.dataset.sort;

            // If same column, toggle order; else reset to 'asc'
            // Current sort clicked again -> toggle order
            if (currentSort === sortColumn) {
                currentOrder = currentOrder === "asc" ? "desc" : "asc";
            //Different sort clicked -> Change current sort    
            } else {
                currentSort = sortColumn;
                currentOrder = "asc";
            }

            // Fetch books with new sorting
            getBooks(currentSort, currentOrder).then(books => {
                bookListDiv.innerHTML = renderBookList(books, currentSort, currentOrder);
                // Reattach sorting after rerender
                enableBookSorting();
            });
        });
    });
}